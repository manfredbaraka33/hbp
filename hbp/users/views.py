from rest_framework import generics,permissions # type: ignore
from .serializers import CustomUserSerializer,ChangePasswordSerializer
from .models import CustomUser
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework import permissions,views # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.decorators import api_view # type: ignore
from rest_framework import generics,status # type: ignore
from rest_framework.response import Response # type: ignore




class UserdetailAPIView(generics.RetrieveAPIView):
     queryset= CustomUser.objects.all()
     serializer_class = CustomUserSerializer
     permission_classes=[permissions.IsAuthenticated]

     def get_object(self):
          return self.request.user
     
user_details = UserdetailAPIView.as_view()



class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, queryset=None):
        # Returns the current authenticated user
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Set the new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'detail': 'Password updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
