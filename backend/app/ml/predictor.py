import os
import pandas as pd
import joblib
from app.database import engine

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
encoders = joblib.load(os.path.join(BASE_DIR, "encoders.pkl"))

FEATURES = [
    'store_id', 'product_id', 'category', 'region',
    'price', 'discount', 'competitor_pricing',
    'inventory_level', 'units_ordered', 'demand_forecast',
    'holiday_promotion', 'weather_condition', 'seasonality',
    'day_of_week', 'month',
    'sales_lag1', 'sales_lag7', 'sales_lag30',
    'rolling_mean_7', 'rolling_mean_30', 'rolling_std_7'
]

def predict_units(store_id: str, product_id: str):
    df = pd.read_sql(
        f"""
        SELECT * FROM inventory_data
        WHERE store_id='{store_id}'
        AND product_id='{product_id}'
        ORDER BY date
        """,
        engine
    )

    if len(df) < 30:
        return {"error": "Not enough historical data"}

    df['date'] = pd.to_datetime(df['date'])
    df['seasonality'] = df['seasonality'].astype(str).str.strip()
    df['weather_condition'] = df['weather_condition'].astype(str).str.strip()
    df['category'] = df['category'].astype(str).str.strip()
    df['region'] = df['region'].astype(str).str.strip()

    numeric_cols = [
        'price', 'discount', 'competitor_pricing',
        'inventory_level', 'units_ordered',
        'demand_forecast', 'holiday_promotion',
        'units_sold'
    ]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')

    df['day_of_week'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month

    latest = df.iloc[-1].copy()

    latest['sales_lag1'] = df['units_sold'].iloc[-1]
    latest['sales_lag7'] = df['units_sold'].iloc[-7]
    latest['sales_lag30'] = df['units_sold'].iloc[-30]

    latest['rolling_mean_7'] = df['units_sold'].tail(7).mean()
    latest['rolling_mean_30'] = df['units_sold'].tail(30).mean()
    latest['rolling_std_7'] = df['units_sold'].tail(7).std()

    for col, enc in encoders.items():
        latest[col] = enc.transform([latest[col]])[0]

    X = pd.DataFrame([latest[FEATURES]])
    prediction = int(round(model.predict(X)[0]))

    return {
        "predicted_units": prediction,
        "predicted_weekly_sales": prediction * 7
    }
