from rest_framework import serializers

from quizes.models import Quize, Answers



class QuizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quize
        fields = "__all__"


class JoinedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        fields = "__all__"




