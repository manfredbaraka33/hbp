from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with email as the primary identifier.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
  
    ROLE_CHOICES = [
        ('doctor', 'Doctor/Clinician-Physician'),
        ('nurse', 'Nurse'),
        ('analyst', 'Data Analyst'),
        ('admin', 'Admin'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='nurse')
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True,default="default.jpg")
    
    # Define custom related names for 'groups' and 'user_permissions'
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_groups',  # Custom related_name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_permissions',  # Custom related_name
        blank=True
    )

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    USERNAME_FIELD = 'username'  
    REQUIRED_FIELDS = ['email']  
