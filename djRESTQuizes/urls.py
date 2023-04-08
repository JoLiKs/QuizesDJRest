"""djRESTQuizes URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from multiprocessing import Process

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

import tg_userbot
from quizes import views
from quizes.views import QuizesAPIVisew, Joined, TG


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/quizes/', QuizesAPIVisew.as_view()),
    path('api/joined/', Joined.as_view()),
    path('api/tg/', TG.as_view())
]
