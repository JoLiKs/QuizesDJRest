# Generated by Django 4.1.7 on 2023-04-02 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quizes', '0003_answers'),
    ]

    operations = [
        migrations.AddField(
            model_name='answers',
            name='isCorrect',
            field=models.BooleanField(default=False),
        ),
    ]
