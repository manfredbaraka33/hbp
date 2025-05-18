from rest_framework import serializers # type: ignore # type: ignore#
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
