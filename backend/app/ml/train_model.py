import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

from app.database import engine

print("🔄 Loading data from MySQL...")

# -------------------------------------------------
# LOAD DATA
# -------------------------------------------------
df = pd.read_sql("SELECT * FROM inventory_data", engine)

# -------------------------------------------------
# BASIC PREPROCESSING
# -------------------------------------------------
df['date'] = pd.to_datetime(df['date'])
df = df.sort_values('date')
df.ffill(inplace=True)

# Clean string columns
df['seasonality'] = df['seasonality'].astype(str).str.strip()
df['weather_condition'] = df['weather_condition'].astype(str).str.strip()
df['category'] = df['category'].astype(str).str.strip()
df['region'] = df['region'].astype(str).str.strip()

# -------------------------------------------------
# 🚨 CRITICAL FIX: FORCE NUMERIC COLUMNS
# -------------------------------------------------
numeric_cols = [
    'price',
    'discount',
    'competitor_pricing',
    'inventory_level',
    'units_ordered',
    'demand_forecast',
    'holiday_promotion',
    'units_sold'
]

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# -------------------------------------------------
# DATE FEATURES
# -------------------------------------------------
df['day_of_week'] = df['date'].dt.dayofweek
df['month'] = df['date'].dt.month

# -------------------------------------------------
# LAG FEATURES
# -------------------------------------------------
df['sales_lag1'] = df.groupby(['store_id', 'product_id'])['units_sold'].shift(1)
df['sales_lag7'] = df.groupby(['store_id', 'product_id'])['units_sold'].shift(7)
df['sales_lag30'] = df.groupby(['store_id', 'product_id'])['units_sold'].shift(30)

# -------------------------------------------------
# ROLLING FEATURES
# -------------------------------------------------
df['rolling_mean_7'] = df.groupby(['store_id', 'product_id'])['units_sold'].transform(
    lambda x: x.rolling(7).mean()
)
df['rolling_mean_30'] = df.groupby(['store_id', 'product_id'])['units_sold'].transform(
    lambda x: x.rolling(30).mean()
)
df['rolling_std_7'] = df.groupby(['store_id', 'product_id'])['units_sold'].transform(
    lambda x: x.rolling(7).std()
)

# Remove rows created by lag/rolling
print("Rows before dropna:", len(df))
# df.dropna(inplace=True)
print("Rows before dropna:", len(df))


# -------------------------------------------------
# LABEL ENCODING
# -------------------------------------------------
label_cols = [
    'store_id',
    'product_id',
    'category',
    'region',
    'weather_condition',
    'seasonality'
]

encoders = {}
for col in label_cols:
    enc = LabelEncoder()
    df[col] = enc.fit_transform(df[col])
    encoders[col] = enc

# -------------------------------------------------
# FEATURES & TARGET
# -------------------------------------------------
features = [
    'store_id', 'product_id', 'category', 'region',
    'price', 'discount', 'competitor_pricing',
    'inventory_level', 'units_ordered', 'demand_forecast',
    'holiday_promotion', 'weather_condition', 'seasonality',
    'day_of_week', 'month',
    'sales_lag1', 'sales_lag7', 'sales_lag30',
    'rolling_mean_7', 'rolling_mean_30', 'rolling_std_7'
]

X = df[features]
y = df['units_sold']

# -------------------------------------------------
# TRAIN / TEST SPLIT (TIME-AWARE)
# -------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, shuffle=False
)

# -------------------------------------------------
# TRAIN XGBOOST MODEL
# -------------------------------------------------
model = xgb.XGBRegressor(
    objective="reg:squarederror",
    n_estimators=300,
    max_depth=10,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

model.fit(X_train, y_train)

# -------------------------------------------------
# SAVE MODEL & ENCODERS
# -------------------------------------------------
joblib.dump(model, "app/ml/model.pkl")
joblib.dump(encoders, "app/ml/encoders.pkl")

print("✅ Model training completed successfully")
print("💾 model.pkl and encoders.pkl saved")
