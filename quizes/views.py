import asyncio
import os
import re
import threading
from multiprocessing import Process
import openai
from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
import tg_userbot
import json

from quizes import keys
from quizes.models import Quize, Answers
from quizes.serializers import JoinedSerializer, QuizeSerializer


@csrf_exempt
def main_page(request):
    context = {}
    return render(request, 'index.html', context=context)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = request.POST
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error_message': 'Invalid username or password'})


@login_required
@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'success': True})



def validate_email(email):
        EMAILT_PATTERN = '[a-zA-Zа-яА-ЯёЁ0-9]+@[a-zA-Zа-яА-ЯёЁ0-9]+\.[a-zA-Zа-яА-ЯёЁ0-9]+'
        res = re.findall(EMAILT_PATTERN, email)
        return res[0] if len(res) >= 1 else None

@csrf_exempt
def registration(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data['username'] == '' or data['password'] == '':
            return JsonResponse({'success': False, 'message': 'Введите имя пользователя и пароль!'})
        if validate_email(data['email']) is None:
            return JsonResponse(status=400, data={'success': False, 'message': 'Вы ввели некорректный email'})
        try:
            User.objects.create_user(
                username=data['username'],
                password=data['password'],
                email=data['email']
            )
            if "test_" in data['username']:
                print("test save")
            return JsonResponse({'success': True, 'message': 'Пользователь успешно зарегистрирован'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Не удалось зарегистрировать нового пользователя'})
    elif request.method == 'GET':
        return


@login_required
def get_user_data(request):
    user = {
        'username': request.user.username,
        'user_id': request.user.id
    }
    return JsonResponse(user)



@login_required
@csrf_exempt
def create_new_quiz(request):
    if request.method == 'POST':
        list_answers: list = request.POST.getlist("answers[]")
        if len(list_answers) < 2 or request.POST['question'] == '' or request.POST['radio'] == '':
            return JsonResponse({'success': False, 'message': 'Введите вопрос и минимум два ответа'})
        quiz = Quize.objects.create()
        quiz.question = request.POST['question']
        quiz.save()
        list_answers[int(request.POST['radio']) - 1] += "!!"
        for ans in list_answers:
            answer = Answers.objects.create()
            if "!!" in ans:
                answer.isCorrect = True
                ans = ans.replace("!!", "")
            answer.val = ans
            answer.question = quiz
            answer.save()
        return JsonResponse(safe=False, data={"success": True})


@csrf_exempt
def gen_imgs(request):
    return render(request, 'generate-images.html')


@csrf_exempt
def gen_q(request):
    if request.method == 'POST':
        openai.api_key = keys.openai
        completion = openai.Completion.create(engine="text-davinci-003",
                                              prompt=str("Придумай краткий вопрос"),
                                              max_tokens=270)

        return JsonResponse(safe=False, data={"success": True, "message": completion.choices[0]['text']})


@csrf_exempt
def generate(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        openai.api_key = keys.openai
        res = openai.Image.create(prompt=data['prompt'],
                                  n=1,
                                  size="1024x1024")
        image_url = res['data'][0]['url']
        return JsonResponse(safe=False, data={"success": True, "message": image_url})


class QuizesAPIVisew(generics.ListAPIView):
    queryset = Quize.objects.all()
    serializer_class = QuizeSerializer


class Joined(generics.ListAPIView):
    queryset = Answers.objects.all()
    serializer_class = JoinedSerializer


class TG(APIView):
    def worker(self, loop, request):
        asyncio.set_event_loop(loop)
        data = request.data
        p = Process(target=tg_userbot.sendMsg, kwargs={'user': data['user'], 'msg': data['msg']})
        p.start()
        p.join()

    @csrf_exempt
    def post(self, request: Request):
        loop = asyncio.new_event_loop()
        p = threading.Thread(target=self.worker, args=(loop, request))
        p.start()
        return Response(data="results was sended!")
