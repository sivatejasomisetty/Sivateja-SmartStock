# import time
# import pandas as pd
# from app.database import engine
# from app.ml.predictor import predict_units

# # -----------------------------
# # CACHE SETTINGS
# # -----------------------------
# CACHE_TTL = 300  # 5 minutes
# _alert_cache = {
#     "data": None,
#     "timestamp": 0
# }

# SAFETY_STOCK_PERCENT = 0.20
# OVERSTOCK_MULTIPLIER = 2.5


# def generate_alerts():
#     current_time = time.time()

#     # ✅ Return cached alerts if still valid
#     if (
#         _alert_cache["data"] is not None
#         and current_time - _alert_cache["timestamp"] < CACHE_TTL
#     ):
#         return _alert_cache["data"]

#     # 🔄 Recompute alerts
#     df = pd.read_sql(
#         "SELECT * FROM inventory_data ORDER BY date",
#         engine
#     )

#     latest_df = (
#         df.sort_values("date")
#           .groupby(["store_id", "product_id"])
#           .tail(1)
#     )

#     alerts = []

#     for _, row in latest_df.iterrows():
#         store_id = row["store_id"]
#         product_id = row["product_id"]
#         inventory = int(row["inventory_level"])

#         prediction = predict_units(store_id, product_id)
#         if "error" in prediction:
#             continue

#         weekly_demand = prediction["predicted_weekly_sales"]
#         safety_stock = int(weekly_demand * SAFETY_STOCK_PERCENT)

#         if inventory < weekly_demand * 0.8:
#             status = "CRITICAL UNDERSTOCK"
#             suggestion = "Immediate reorder required"
#         elif inventory < weekly_demand + safety_stock:
#             status = "UNDERSTOCK"
#             suggestion = "Reorder soon"
#         elif inventory > weekly_demand * OVERSTOCK_MULTIPLIER:
#             status = "OVERSTOCK"
#             suggestion = "Reduce future orders"
#         else:
#             status = "NORMAL"
#             suggestion = "Inventory level is healthy"

#         alerts.append({
#             "store_id": store_id,
#             "product_id": product_id,
#             "category" : row.category,
#             "inventory_level": inventory,
#             "predicted_weekly_sales": weekly_demand,
#             "safety_stock": safety_stock,
#             "status": status,
#             "suggestion": suggestion
#         })

#     # 💾 Save to cache
#     _alert_cache["data"] = alerts
#     _alert_cache["timestamp"] = current_time

#     return alerts











# app/ml/alerts.py

import time
import pandas as pd
from app.database import engine
from app.ml.predictor import predict_units

# -----------------------------
# CACHE SETTINGS
# -----------------------------
CACHE_TTL = 300  # 5 minutes
_alert_cache = {
    "data": None,
    "timestamp": 0
}

SAFETY_STOCK_PERCENT = 0.20
OVERSTOCK_MULTIPLIER = 2.5


def generate_alerts():
    current_time = time.time()

    # -----------------------------
    # RETURN CACHED DATA IF VALID
    # -----------------------------
    if (
        _alert_cache["data"] is not None
        and current_time - _alert_cache["timestamp"] < CACHE_TTL
    ):
        return _alert_cache["data"]

    # -----------------------------
    # LOAD REQUIRED DATA
    # -----------------------------
    df = pd.read_sql(
        """
        SELECT
            store_id,
            product_id,
            category,
            inventory_level,
            date
        FROM inventory_data
        """,
        engine
    )

    if df.empty:
        return []

    # -----------------------------
    # GET LATEST RECORD PER STORE + PRODUCT
    # -----------------------------
    latest_df = (
        df.sort_values("date")
          .groupby(["store_id", "product_id"], as_index=False)
          .last()
    )

    alerts = []

    # -----------------------------
    # MAIN ALERT + PREDICTION LOGIC
    # -----------------------------
    for _, row in latest_df.iterrows():
        store_id = row["store_id"]
        product_id = row["product_id"]
        inventory = int(row["inventory_level"])

        # ✅ ALWAYS GET PREDICTION
        prediction = predict_units(store_id, product_id)
        if "error" in prediction:
            continue

        weekly_demand = int(prediction["predicted_weekly_sales"])
        daily_demand = int(weekly_demand / 7)
        safety_stock = int(weekly_demand * SAFETY_STOCK_PERCENT)

        # -----------------------------
        # ALERT STATUS LOGIC
        # -----------------------------
        if inventory < weekly_demand * 0.8:
            status = "CRITICAL UNDERSTOCK"
            suggestion = "Immediate reorder required"
        elif inventory < weekly_demand + safety_stock:
            status = "UNDERSTOCK"
            suggestion = "Reorder soon"
        elif inventory > weekly_demand * OVERSTOCK_MULTIPLIER:
            status = "OVERSTOCK"
            suggestion = "Reduce future orders"
        else:
            status = "NORMAL"
            suggestion = "Inventory level is healthy"

        alerts.append({
            "store_id": store_id,
            "product_id": product_id,
            "category": row["category"],
            "inventory_level": inventory,
            "predicted_daily_sales": daily_demand,
            "predicted_weekly_sales": weekly_demand,
            "safety_stock": safety_stock,
            "status": status,
            "suggestion": suggestion
        })

    # -----------------------------
    # SAVE CACHE
    # -----------------------------
    _alert_cache["data"] = alerts
    _alert_cache["timestamp"] = current_time

    return alerts
