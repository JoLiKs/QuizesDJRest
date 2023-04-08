from rest_framework import serializers

from quizes.models import Quize, Answers, TGsnip


class QuizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quize
        fields = "__all__"

class JoinedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        fields = "__all__"


class TGsnipSerializer(serializers.ModelSerializer):
    class Meta:
        model = TGsnip
        fields = "__all__"