# import os
# from dotenv import load_dotenv
# import google.generativeai as genai

# from app.ml.alerts import generate_alerts
# from app.ml.predictor import predict_units

# # Load env
# load_dotenv(dotenv_path=os.path.join(os.getcwd(), ".env"))

# API_KEY = os.getenv("GEMINI_API_KEY")
# if not API_KEY:
#     raise RuntimeError("GEMINI_API_KEY not loaded")

# print("🔑 Gemini API key loaded successfully")

# genai.configure(api_key=API_KEY)

# # ✅ Working model
# model = genai.GenerativeModel("gemini-2.5-flash")


# def chatbot_response(message: str):
#     try:
#         msg = message.lower()

#         if "understock" in msg or "alert" in msg:
#             alerts = generate_alerts()
#             context = f"Inventory alerts: {alerts}"

#         elif "predict" in msg or "demand" in msg:
#             prediction = predict_units("S001", "P0001")
#             context = f"Demand prediction: {prediction}"

#         else:
#             context = "General inventory assistance."

#         prompt = f"""
# You are SmartStock AI, an inventory management assistant.

# User question:
# {message}

# System data:
# {context}

# Answer clearly and concisely.
# """

#         response = model.generate_content(prompt)
#         return response.text

#     except Exception as e:
#         print("🔥 Gemini error:", e)
#         return "Sorry, the chatbot is currently unavailable."









# app/chatbot.py

import os
import re
from dotenv import load_dotenv
import google.generativeai as genai

from app.chatbot_utils import get_stock_by_product_name
from app.ml.alerts import generate_alerts
from app.ml.predictor import predict_units

# --------------------------------------------------
# ENV & GEMINI SETUP
# --------------------------------------------------
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not loaded")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

# --------------------------------------------------
# INTENT DETECTION
# --------------------------------------------------
def detect_intent(msg: str):
    msg = msg.lower()

    if any(k in msg for k in ["overstock", "understock", "alert"]):
        return "ALERT"

    if any(k in msg for k in ["predict", "prediction", "forecast", "expected", "demand", "next week"]):
        return "PREDICTION"

    if any(k in msg for k in ["how many", "stock", "available", "present", "are there", "in store", "in"]):
        return "STOCK"

    return "GENERAL"

# --------------------------------------------------
# STORE EXTRACTION
# --------------------------------------------------
def extract_store(msg: str):
    match = re.search(r"(hyd-\w+|blr-\w+|s\d{3})", msg)
    return match.group(0).upper() if match else None

# --------------------------------------------------
# PRODUCT QUERY EXTRACTION
# --------------------------------------------------
def extract_product_query(msg: str):
    words = msg.lower().split()

    ignore = {
        "how", "many", "are", "there", "present", "available",
        "units", "items", "stock", "in", "store",
        "predict", "prediction", "forecast", "expected",
        "demand", "next", "week", "sales"
    }

    # remove store ids
    words = [w for w in words if not re.match(r"(hyd-\w+|blr-\w+|s\d{3})", w)]

    # simple plural handling
    def singularize(w):
        return w[:-1] if w.endswith("s") else w

    clean = [singularize(w) for w in words if w not in ignore]

    return " ".join(clean)

# --------------------------------------------------
# MAIN CHATBOT FUNCTION
# --------------------------------------------------
def chatbot_response(message: str, user=None):
    try:
        msg = message.strip().lower()
        intent = detect_intent(msg)
        store_id = extract_store(msg)

        # ================= ALERTS =================
        if intent == "ALERT":
            alerts = generate_alerts()

            if "overstock" in msg:
                count = sum(1 for a in alerts if a.get("status") == "OVERSTOCK")
                return f"There are {count} overstocked items."

            if "understock" in msg:
                count = sum(1 for a in alerts if "UNDERSTOCK" in a.get("status", ""))
                return f"There are {count} understocked items."

            return f"There are {len(alerts)} products being monitored for alerts."

        # ================= PREDICTION =================
        if intent == "PREDICTION":
            product_query = extract_product_query(msg)

            if not product_query:
                return "Please mention the product name for prediction."

            data = get_stock_by_product_name(product_query, store_id)

            if not data:
                return "No matching products found for prediction."

            product_id = data[0]["product_id"]
            store_for_prediction = store_id or data[0]["store_id"]

            prediction = predict_units(store_for_prediction, product_id)

            if not prediction or "error" in prediction:
                return "Prediction data is currently unavailable."

            daily = prediction.get("predicted_daily_sales", 0)
            weekly = prediction.get("predicted_weekly_sales", 0)

            return (
                f"Predicted demand for {product_query}"
                + (f" in store {store_for_prediction}" if store_id else "")
                + f": {daily} units per day, {weekly} units per week."
            )

        # ================= STOCK =================
        if intent == "STOCK":
            product_query = extract_product_query(msg)

            if not product_query:
                return "Please mention the product name."

            data = get_stock_by_product_name(product_query, store_id)

            if not data:
                return "No matching products found in inventory."

            total = 0
            for row in data:
                val = row.get("inventory_level", 0)
                try:
                    total += int(float(val))
                except Exception:
                    continue

            if store_id:
                return f"There are {total} units of {product_query} in store {store_id}."
            else:
                return f"There are {total} units of {product_query} available across all stores."

        # ================= GEMINI FALLBACK =================
        prompt = f"""
You are SmartStock AI, an inventory management assistant.

User question:
{message}

Answer clearly and concisely.
"""
        response = model.generate_content(prompt)
        return response.text

    except Exception:
        import traceback
        traceback.print_exc()
        return "Internal error while processing your request."
