from datetime import datetime
from django.shortcuts import render
# Pour la reponse au code JS
from django.http import JsonResponse


# langchain
from langchain.llms import HuggingFaceHub
from dotenv import load_dotenv


load_dotenv()

# Create your views here.
def index(request):
    return render(request, "landingPage/index.html")


def question(request):
    date = datetime.today()
    return render(request, "appQuestion/index.html", context={"date": date})

def get_answer(request):
    if request.method == 'POST':

        # Utilisation de base, similaire a celle de l'api
        llm = HuggingFaceHub(repo_id="google/flan-t5-xxl", model_kwargs={"temperature": 0.8, "minTokens": 100})
        print(llm("hello"))


        input_text = request.POST.get('question', '') # Récupérer la question de l'utilisateur
        print(input_text)
        # Traiter l'input avec votre modèle Hugging Face pour obtenir la réponse
        answer = llm(input_text)
        # Retourner la réponse en JSON
        return JsonResponse({'answer': answer})