from fastapi import Header, HTTPException
from app.firebase_auth import verify_firebase_token
from app.database import engine
import pandas as pd

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    token = authorization.replace("Bearer ", "")
    decoded = verify_firebase_token(token)

    uid = decoded["uid"]

    # 🔍 Fetch user from MySQL
    user_df = pd.read_sql(
        f"SELECT * FROM users WHERE uid='{uid}'",
        engine
    )

    if user_df.empty:
        raise HTTPException(status_code=403, detail="User not registered")

    return user_df.iloc[0]
