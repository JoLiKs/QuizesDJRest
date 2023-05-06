from django.urls import path
from rest_framework import routers
from . import views

app_name = 'quiz_core_app'

router = routers.DefaultRouter()


urlpatterns = [
    path('', views.main_page, name='main-page'),
    path('user/login/', views.login_view, name='login'),
    path('registration/', views.registration, name='registration'),
    path('user/logout/', views.logout_view, name='logout'),
    path('create-new-quiz/', views.create_new_quiz, name="quiz-creation-page"),
    path('gen_q/', views.gen_q, name="gen_q"),
    path('generate-images/', views.gen_imgs, name="gen_imgs"),
    path('generate/', views.generate, name="generate"),

]