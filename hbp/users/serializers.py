from rest_framework import serializers # type: ignore
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError # type: ignore



class CustomUserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'profile_image','role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

   
    def validate_username(self, value):
        user = self.context.get('user')

        # If no user is provided, just check if the username exists
        if user:
            if CustomUser.objects.filter(username=value).exclude(id=user.id).exists():
                raise ValidationError("This username is already taken.")
        else:
            if CustomUser.objects.filter(username=value).exists():
                raise ValidationError("This username is already taken.")

        return value


    def validate_email(self, value):
        user = self.context.get('user')

        if user:
            if CustomUser.objects.filter(email=value).exclude(id=user.id).exists():
                raise ValidationError("This email is already taken.")
        else:
            if CustomUser.objects.filter(email=value).exists():
                raise ValidationError("This email is already taken.")

        return value


    def update(self, instance, validated_data):
        # Only update fields that are passed in the request data
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.bio = validated_data.get('bio', instance.bio)

        # Handle image upload if provided
        if 'profile_image' in validated_data:
            instance.profile_image = validated_data.get('profile_image', instance.profile_image)

        instance.save()
        return instance

    def create(self, validated_data):
        # Create a new user instance (same logic as before for password handling)
        password = validated_data.pop('password')
        
        user = CustomUser.objects.create(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()

        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        # Check if the new passwords match
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords do not match.")
        # Validate the new password using Django's built-in validators
        validate_password(attrs['new_password'])
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value
