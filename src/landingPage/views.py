from datetime import datetime
from django.shortcuts import render
# Pour la reponse au code JS
from django.http import JsonResponse
from langchain import PromptTemplate, LLMChain

# langchain
from dotenv import load_dotenv
from langchain import HuggingFaceHub, PromptTemplate, LLMChain
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.document_loaders import TextLoader
from langchain.vectorstores import FAISS


load_dotenv()

# Create your views here.
def index(request):
    return render(request, "landingPage/index.html")


def question(request):
    date = datetime.today()
    return render(request, "appQuestion/index.html", context={"date": date})


def how(request):
    return render(request, "how/how.html")

def get_answer(request):
    if request.method == 'POST':

        llm = HuggingFaceHub(repo_id="google/flan-t5-xxl", model_kwargs={"temperature": 0.8})

        loader = TextLoader('context.txt')
        documents = loader.load()
        # Text Splitter
        text_splitter = CharacterTextSplitter(chunk_size=10, chunk_overlap=5)
        docs = text_splitter.split_documents(documents)

        print(len(docs))

        embeddings = HuggingFaceEmbeddings()

        # Vector Strore
        db = FAISS.from_documents(docs, HuggingFaceEmbeddings())


        query = request.POST.get('question', '')  # Récupérer la question de l'utilisateur
        docs = db.similarity_search(query)
        similarity = docs[0].page_content
        question = '{question}'

        # similarity = """ Je m'appelle Raphael Giraud.
        #
        #             J'ai 19 ans.
        #
        #             Je suis né à Montpellier.
        #
        #             Je fais des études d'informatique à Grenoble.
        #
        #             Je suis sportif de haut niveau et étudiant en même temps.
        #
        #             J'adore les lasagnes.
        #
        #             Je suis sportif de haut-niveau en VTT.
        #
        #             Mes meilleurs classements en VTT sont :
        #
        #             14ème en Coupe du monde Junior
        #             Top 10 en Coupe de France VTT.
        #
        #             My name is Raphael Giraud.
        #
        #             I'm 19 years old.
        #
        #             I was born in Montpellier.
        #
        #             I study computer science in Grenoble.
        #
        #             I am a high-level athlete and a student at the same time.
        #
        #             I love lasagna.
        #
        #             I am a high-level athlete in mountain biking.
        #
        #             My best rankings in mountain biking are:
        #
        #             14th in Junior World Cup
        #             Top 10 in French Cup MTB. """
        # question = '{question}'


        # Prompt template
        template1 = """Act as if you are a human named Raphael Giraud. 
                    Answer in French
                    You will have some questions and you must answer as if you were Raphael like . 
                    Answer as if you were having a conversation with friends, using sentences
                    Here is some information about Raphael Giraud that you need to write in your response : {context}
                    Make sentence about this information
                    Write a big answer
                    Here is the question : {question}"""

        template = template1.format(context=similarity, question=question)

        print(template)

        prompt = PromptTemplate(
            template=template,
            input_variables=["question"]
        )

        chain = LLMChain(llm=llm, prompt=prompt, verbose=True)


        # Traiter l'input avec votre modèle Hugging Face pour obtenir la réponse
        answer = chain.run(query)

        print("réponse de l'ia : " + answer)
        # Retourner la réponse en JSON
        return JsonResponse({'answer': answer})