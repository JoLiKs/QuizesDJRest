# Generated by Django 4.1.7 on 2023-04-02 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quizes', '0010_alter_quize_question'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='answers',
            name='question',
        ),
        migrations.AlterField(
            model_name='answers',
            name='val',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='quize',
            name='question',
            field=models.CharField(max_length=200),
        ),
    ]