import firebase_admin
from firebase_admin import credentials, auth
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

cred = credentials.Certificate(
     json.loads(os.getenv("FIREBASE_CREDENTIALS"))
)

firebase_admin.initialize_app(cred)

def verify_firebase_token(token: str):
    decoded_token = auth.verify_id_token(token)
    return decoded_token
