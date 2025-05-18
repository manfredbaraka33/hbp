from django.urls import path,include
from rest_framework_simplejwt import views as jwt_views # type: ignore
from users.views import user_details
from patients import views as patient_views
from patients.views import ReceiveExternalPatientAPIView,ReceiveExternalPatientUpdateAPIView


urlpatterns = [
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Token login
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),  # Token refresh
    path('user/details/',user_details),
    path('register_patient/',patient_views.patient_create_view),
    path('all_patients/',patient_views.patients_list_view),
    path('search/',patient_views.search_patient),
    path('patient-details/<int:pk>/',patient_views.patient_details),
    path('patients/<int:pk>/toggle_vaccination/',patient_views.toggle_vaccination_status , name='toggle-vaccination'),
    path('receive-patient/', ReceiveExternalPatientAPIView.as_view()),
    path('receive-patient-update/<int:pk>/', ReceiveExternalPatientUpdateAPIView.as_view(), name='update-patient'), 
    path('genai-query/',patient_views.genai_query),
    path('report-gen/',patient_views.generate_report),

]