from django.db import models
from datetime import timedelta, datetime
from django.db import models
from datetime import datetime

from sqlalchemy.orm import declarative_base


class Quize(models.Model):
    question = models.CharField(max_length=200)

    def __str__(self):
        return self.question


class Answers(models.Model):
    val = models.CharField(max_length=200)
    question = models.ForeignKey(Quize, on_delete=models.SET_NULL, null=True, unique=False)
    isCorrect = models.BooleanField(default=False)

    def __str__(self):
        return self.val


