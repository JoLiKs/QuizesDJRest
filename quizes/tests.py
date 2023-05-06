import random

from rest_framework.test import RequestsClient

client = RequestsClient()
response = client.post('http://127.0.0.1:8000/registration/', json={'username': f'test_{random.randint(1,1000)}', 'password': 'testpass', 'email': 'testmail@ukr.ua'})
print(response.status_code)
assert response.status_code == 200


response = client.post('http://127.0.0.1:8000/user/login/', json={'username': f'test_{random.randint(1,1000)}', 'password': 'testpass'})
print(response.status_code)
assert response.status_code == 200