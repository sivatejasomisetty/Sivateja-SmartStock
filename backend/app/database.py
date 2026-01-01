import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URI = os.getenv("DATABASE_URI")

if not DATABASE_URI:
    raise RuntimeError("DATABASE_URI is not set")

engine = create_engine(DATABASE_URI)
