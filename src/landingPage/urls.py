from django.urls import path
from .views import index, question, get_answer

urlpatterns = [
    path('', index, name="homePage-index"),
    path('question/', question, name="appQuestion"),
    path('get_answer/', get_answer, name="get_answer")
]