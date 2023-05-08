from django.urls import path
from .views import index, question, get_answer, how

urlpatterns = [
    path('', index, name="homePage"),
    path('question/', question, name="appQuestion"),
    path('get_answer/', get_answer, name="get_answer"),
    path('how', how, name="how")
]