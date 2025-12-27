import firebase_admin
from firebase_admin import credentials, auth
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

cred = credentials.Certificate(
    os.path.join(BASE_DIR, "firebase_admin_key.json")
)

firebase_admin.initialize_app(cred)

def verify_firebase_token(token: str):
    decoded_token = auth.verify_id_token(token)
    return decoded_token
