from multiprocessing import Process

from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.parsers import JSONParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
import tg_userbot
from quizes.models import Quize, Answers, TGsnip
from quizes.serializers import QuizeSerializer, JoinedSerializer, TGsnipSerializer


class QuizesAPIVisew(generics.ListAPIView):
    queryset = Quize.objects.all()
    serializer_class = QuizeSerializer


class Joined(generics.ListAPIView):
    queryset = Answers.objects.all()
    serializer_class = JoinedSerializer

class TG(APIView):
    def post(self, request: Request):
        data = request.data
        print(data)
        p = Process(target=tg_userbot.sendMsg, kwargs={'user':data['user'], 'msg':data['msg']})
        p.start()
        p.join()
        return Response(data="results was sended!")