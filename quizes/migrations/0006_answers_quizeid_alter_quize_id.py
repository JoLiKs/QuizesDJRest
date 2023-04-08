# Generated by Django 4.1.7 on 2023-04-02 12:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('quizes', '0005_answers_val'),
    ]

    operations = [
        migrations.AddField(
            model_name='answers',
            name='quizeId',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, to='quizes.quize'),
        ),
        migrations.AlterField(
            model_name='quize',
            name='id',
            field=models.CharField(max_length=200, primary_key=True, serialize=False),
        ),
    ]