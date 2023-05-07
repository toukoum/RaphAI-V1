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

def get_answer(request):
    if request.method == 'POST':

        llm = HuggingFaceHub(repo_id="google/flan-t5-xxl", model_kwargs={"temperature": 0.8, "max_length": 512})

        loader = TextLoader('../context.txt')
        documents = loader.load()

        # Text Splitter
        text_splitter = CharacterTextSplitter(chunk_size=10, chunk_overlap=0)
        docs = text_splitter.split_documents(documents)

        print(len(docs))

        embeddings = HuggingFaceEmbeddings()

        # Vector Strore
        db = FAISS.from_documents(docs, embeddings)

        query = request.POST.get('question', '')  # Récupérer la question de l'utilisateur
        docs = db.similarity_search(query)
        similarity = docs[0].page_content
        question = '{question}'


        # Prompt template
        template1 = """Act as if you are a human named Raphael Giraud. 
                    Answer in the language of the question
                    You will have some questions and you must answer as if you were Raphael like . 
                    Answer as if you were having a conversation with friends, using sentences
                    Here is some information about Raphael Giraud that you need to write in your response : {context}
                    Make sentence about this information
                    Write a long answer
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