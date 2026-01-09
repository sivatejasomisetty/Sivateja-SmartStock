# import os
# from sqlalchemy import create_engine
# from dotenv import load_dotenv

# load_dotenv()

# DATABASE_URI = os.getenv("DATABASE_URI")

# if not DATABASE_URI:
#     raise RuntimeError("DATABASE_URI is not set")

# engine = create_engine(DATABASE_URI)












# app/database.py

import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URI = os.getenv("DATABASE_URI")

if not DATABASE_URI:
    raise RuntimeError("DATABASE_URI is not set")

engine = create_engine(
    DATABASE_URI,
    pool_size=10,        # max persistent connections
    max_overflow=20,     # extra connections during spike
    pool_timeout=30,     # seconds to wait for connection
    pool_recycle=1800,   # recycle connections every 30 min
    pool_pre_ping=True   # auto-reconnect dropped connections
)
