from django.shortcuts import render
from rest_framework import generics,permissions,status # type: ignore
from .serializers import PatientSerializer
from .models import Patient
from django.http import JsonResponse
from django.db.models import Q
from rest_framework.decorators import api_view # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.views import APIView # type: ignore
from channels.layers import get_channel_layer 
from asgiref.sync import async_to_sync
from .gen_ai_tools import get_hbp_few_shot_db_chain
from django.shortcuts import get_object_or_404
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt





class PatientCreateView(generics.CreateAPIView):
    queryset=Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes=[permissions.IsAuthenticated]
    
    
patient_create_view = PatientCreateView.as_view()



class PatientListView(generics.ListAPIView):
    queryset=Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes=[permissions.IsAuthenticated]

patients_list_view = PatientListView.as_view()


class PatientDetailView(generics.RetrieveAPIView):
    queryset=Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes=[permissions.IsAuthenticated]
    
patient_details = PatientDetailView.as_view()



def search_patient(request):
    query = request.GET.get('query', '')
    if not query:
        return JsonResponse({'error': 'No search query provided'}, status=400)

    patient_results= Patient.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query)
    )
    
    data={
        "results":
            [{
            "id":re.id,
             "first_name":re.first_name,
              "last_name":re.last_name,
              "vaccination_status":re.vaccination_status,
              "gender":re.gender,
              "dob":re.dob,
              "hepatitis_b_stage":re.hepatitis_b_stage,
              "region":re.region,
              "treatment_status":re.treatment_status,
              "treatment_type":re.treatment_type,
              "comorbidities":re.comorbidities
              }
             for re in patient_results]
        
    }
    
    return JsonResponse(data,safe=False)



@api_view(['PATCH']) 
def toggle_vaccination_status(request, pk): 
    try: 
     patient = Patient.objects.get(pk=pk) 
    except Patient.DoesNotExist: 
     return Response(status=status.HTTP_404_NOT_FOUND) 
    patient.vaccination_status = not patient.vaccination_status 
    patient.save() 
    serializer = PatientSerializer(patient) 
    
    return Response("Good") 


class ReceiveExternalPatientAPIView(APIView):
    permission_classes = []
    def post(self, request):
        """
        Receive patient data from external systems (Hospital 1/2)
        """
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            # Save the received patient data
            instance = serializer.save()
            
            channel_layer = get_channel_layer() 
            async_to_sync(channel_layer.group_send)(
                 "notifications",
                 {
                   "type": "send_notification",  
                   "content":{
                       "message":f"New patient registered at {instance.facility}",
                       "patient_id":instance.id,
                       "action":"register"
                   }
                 }
            )
            
            return Response({"message": "Patient data received and saved."}, status=201)
        return Response(serializer.errors, status=400)

        
    
class ReceiveExternalPatientUpdateAPIView(APIView):
    permission_classes = []

    def put(self, request, pk):
        print("🔸 [UPDATE] Request data:", request.data)

        try:
            patient = get_object_or_404(Patient, pk=pk)
            print(f"✅ [UPDATE] Patient found: ID {patient.id}, Name {patient.first_name}")
        except Exception as e:
            print(f"❌ [UPDATE] Patient not found: {str(e)}")
            return Response({"error": "Patient not found"}, status=404)

        # Log vaccination status before and after (for debugging)
        before_status = patient.vaccination_status
        vaccination_status = request.data.get("vaccination_status", None)
        if vaccination_status is not None:
            print(f"🔁 [UPDATE] Vaccination status changing from {before_status} to {vaccination_status}")
            patient.vaccination_status = vaccination_status

        # Update remaining fields
        serializer = PatientSerializer(patient, data=request.data, partial=True)
        if serializer.is_valid():
            instance = serializer.save()
            print("✅ [UPDATE] Patient updated:", instance.id)

            # Notify via channels
            try:
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    "notifications",
                    {
                        "type": "send_notification",
                        "content": {
                            "message": f"Patient with id {instance.id} updated at {instance.facility}",
                            "patient_id": instance.id,
                            "action": "update"
                        },
                    },
                )
                print("📢 [UPDATE] Notification sent")
                
            except Exception as e:
                print("❌ [UPDATE] Channel error:", str(e))

            return Response({"message": "Patient data updated."}, status=200)
        else:
            print("❌ [UPDATE] Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=400)
    
    
    
@api_view(["POST","GET"])
def genai_query(request):
    question = request.data.get("question", "")
    if not question:
        return Response({"error": "Question is required"}, status=400)
    
    try:
        
        chain = get_hbp_few_shot_db_chain()
        response = chain.run(question)
        print(f"Here is the result: {response}")
        return Response({"result": response})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    


from .report_gen import get_report_chain


@api_view(["GET"])
def generate_report(request):
    """
    Runs a suite of predefined questions through the SQL chain,
    then generates one cohesive, multi-section report.
    """
    try:
        # 1) Define all the questions you want metrics for
        questions = [
            "How many patients are currently registered?",
            "How many patients were registered yesterday?",
            "What percentage of patients are female?",
            "List patient counts by hepatitis_b_stage (acute vs chronic).",
            "How many patients are between 30 and 45 years old and not vaccinated?",
            # add more as needed...
        ]

        # 2) Run each through your SQLDatabaseChain
        db_chain = get_hbp_few_shot_db_chain()
        qa_pairs = []
        for q in questions:
            raw_answer = db_chain.run(q)
            qa_pairs.append({"question": q, "answer": raw_answer})

        # 3) Prepare a single text block of the Q&A
        #    e.g. "Q: How many ...? A: 120\nQ: ..."
        qa_summary = "\n\n".join(f"Q: {item['question']}\nA: {item['answer']}"
                                 for item in qa_pairs)

        # 4) Run the comprehensive report chain
        report_chain = get_report_chain()
        report = report_chain.run(qa_summary=qa_summary)

        # 5) Return the full report
        return Response({"report": report}, status=status.HTTP_200_OK)

    except Exception as e:
        print("Tye error is",e)
        return Response(
            {"detail": f"Failed to generate comprehensive report. {e}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        


from .gen_ai_tools import get_hbp_few_shot_db_chain
from .comprehensive_report_chain import get_comprehensive_report_chain

@api_view(["GET"])
def generate_comprehensive_report(request):
    """
    No inputs required. On GET, this will:
      1) Run a list of predefined questions through your SQL few-shot chain
      2) Aggregate the raw answers into a Q&A summary
      3) Feed that summary into the comprehensive report chain
      4) Return {"report": "<comprehensive narrative>"}
    """
    try:
        # 1) Define all the questions you want metrics for
        questions = [
            "How many patients are currently registered?",
            "How many patients were registered yesterday?",
            "What percentage of patients are female?",
            "List patient counts by hepatitis_b_stage (acute vs chronic).",
            "How many patients are between 30 and 45 years old and not vaccinated?",
            # add more questions here as needed...
        ]

        # 2) Run each through your SQLDatabaseChain
        db_chain = get_hbp_few_shot_db_chain()
        qa_pairs = []
        for q in questions:
            try:
                answer = db_chain.run(q)
            except Exception as exc:
                # capture errors per question without failing the whole report
                answer = f"Error generating metric: {exc}"
            qa_pairs.append({"question": q, "answer": answer})

        # 3) Prepare a single text block of the Q&A
        qa_summary = "\n\n".join(f"Q: {item['question']}\nA: {item['answer']}"
                                 for item in qa_pairs)

        # 4) Run the comprehensive report chain
        report_chain = get_comprehensive_report_chain()
        report_text = report_chain.run(qa_summary=qa_summary)

        # 5) Return the full report
        return Response({"report": report_text}, status=status.HTTP_200_OK)

    except Exception:
        # In production: log the full exception details
        return Response(
            {"detail": "Failed to generate comprehensive report."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
