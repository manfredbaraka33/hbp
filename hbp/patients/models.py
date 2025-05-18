from django.db import models

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    ]
    
    HEPATITIS_B_STAGE_CHOICES = [
        ('acute', 'Acute'),
        ('chronic', 'Chronic'),
    ]
    
    TREATMENT_STATUS_CHOICES = [
        ('ongoing', 'On going'),
        ('completed', 'Completed'),
        ('followup','Follow up'),
        
        
    ]
    
    # Patient Demographics
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    dob = models.DateField('Date of Birth')
    contact_number = models.CharField(max_length=15, blank=True)

    hepatitis_b_stage = models.CharField(max_length=7, choices=HEPATITIS_B_STAGE_CHOICES, default='acute')
    treatment_status = models.CharField(max_length=20, choices=TREATMENT_STATUS_CHOICES, default='ongoing')
    treatment_type = models.CharField(max_length=100, blank=True)  
    vaccination_status = models.BooleanField(default=False)  
    comorbidities = models.TextField(blank=True) 
    region = models.CharField(max_length=100)
    registration_date = models.DateTimeField(auto_now_add=True)
    facility = models.CharField(null=True,blank=True)
    
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.hepatitis_b_stage}"
