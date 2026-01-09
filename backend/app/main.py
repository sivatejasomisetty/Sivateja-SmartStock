from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import pandas as pd

from app.database import engine
from app.ml.predictor import predict_units
from app.ml.alerts import generate_alerts
from app.chatbot import chatbot_response

app = FastAPI(title="SmartStock Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
                   "http://localhost:3000",
                   "https://smart-stock-management-theta.vercel.app",
                ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- ML --------------------

@app.get("/predict")
def predict(store_id: str, product_id: str):
    print("PREDICT REQUEST RECEIVED:", store_id, product_id)
    return predict_units(store_id, product_id)


@app.get("/alerts")
def alerts():
    return generate_alerts()

# -------------------- CHATBOT --------------------

# @app.post("/chat")
# def chat(message: str = Body(..., embed=True)):
#     return {"reply": chatbot_response(message)}






from fastapi import Request, HTTPException

@app.post("/chat")
async def chat(request: Request):
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    message = (
        body.get("message")
        or body.get("text")
        or body.get("msg")
    )

    if not message:
        raise HTTPException(status_code=422, detail="Message is required")

    return {
        "reply": chatbot_response(message)
    }





#---------------- Login Test API ------------------------------
from fastapi import Depends
from app.dependencies import get_current_user

@app.get("/api/test-role")
def test_role(user=Depends(get_current_user)):
    return {
        "email": user.email,
        "role": user.role,
        "city": user.city,
        "store_id": user.store_id
    }


#---------------- Products(Role-Aware)---------------------

from fastapi import Body, HTTPException, Depends
from sqlalchemy import text
import pandas as pd

from app.database import engine
from app.dependencies import get_current_user


# =====================================================
# GET ALL PRODUCTS (ADMIN: ALL | MANAGER: OWN STORE)
# =====================================================
@app.get("/api/products/all")
def get_all_products(user=Depends(get_current_user)):
    try:
        if user.role == "admin":
            query = "SELECT * FROM inventory_data LIMIT 2000"
            params = {}
        else:
            query = """
                SELECT * FROM inventory_data
                WHERE store_id = :store_id
                LIMIT 2000
            """
            params = {"store_id": user.store_id}

        df = pd.read_sql(text(query), engine, params=params)
        df = df.where(pd.notnull(df), None)
        return {"products": df.to_dict(orient="records")}

    except Exception as e:
        print("Fetch Error:", e)
        raise HTTPException(status_code=500, detail="DB fetch failed")


# =====================================================
# GET SINGLE PRODUCT (ADMIN: ANY | MANAGER: OWN STORE)
# =====================================================
@app.get("/api/products/{id}")
def get_product(id: int, user=Depends(get_current_user)):

    if user.role == "admin":
        query = "SELECT * FROM inventory_data WHERE id = :id"
        params = {"id": id}
    else:
        query = """
            SELECT * FROM inventory_data
            WHERE id = :id AND store_id = :store_id
        """
        params = {"id": id, "store_id": user.store_id}

    df = pd.read_sql(text(query), engine, params=params)

    if df.empty:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"product": df.iloc[0].to_dict()}


# =====================================================
# ADD PRODUCT (ADMIN: ANY STORE | MANAGER: OWN STORE)
# =====================================================
@app.post("/api/products")
def add_product(product: dict = Body(...), user=Depends(get_current_user)):

    # Force manager to their own store
    if user.role == "manager":
        product["store_id"] = user.store_id

    query = text("""
        INSERT INTO inventory_data
        (store_id, product_id, category, inventory_level, price)
        VALUES (:store_id, :product_id, :category, :inventory_level, :price)
    """)

    with engine.connect() as conn:
        conn.execute(query, product)
        conn.commit()

    return {"message": "Product added successfully"}


# =====================================================
# UPDATE PRODUCT (ADMIN: ANY | MANAGER: OWN STORE)
# =====================================================
@app.put("/api/products/{id}")
def update_product(id: int, product: dict = Body(...), user=Depends(get_current_user)):

    # Basic validation
    if "category" not in product:
        raise HTTPException(status_code=400, detail="Category is required")

    if "inventory_level" not in product or product["inventory_level"] < 0:
        raise HTTPException(status_code=400, detail="Invalid inventory level")

    if "price" not in product or product["price"] <= 0:
        raise HTTPException(status_code=400, detail="Invalid price")

    if user.role == "admin":
        condition = "id = :id"
        params = {"id": id}
    else:
        condition = "id = :id AND store_id = :store_id"
        params = {"id": id, "store_id": user.store_id}

    query = text(f"""
        UPDATE inventory_data
        SET category = :category,
            inventory_level = :inventory_level,
            price = :price
        WHERE {condition}
    """)

    with engine.connect() as conn:
        result = conn.execute(query, {
            **params,
            "category": product["category"],
            "inventory_level": product["inventory_level"],
            "price": product["price"]
        })
        conn.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=403, detail="Not allowed or product not found")

    return {"message": "Product updated successfully"}


# =====================================================
# DELETE PRODUCT (ADMIN: ANY | MANAGER: OWN STORE)
# =====================================================
@app.delete("/api/products/{id}")
def delete_product(id: int, user=Depends(get_current_user)):

    if user.role == "admin":
        query = "DELETE FROM inventory_data WHERE id = :id"
        params = {"id": id}
    else:
        query = """
            DELETE FROM inventory_data
            WHERE id = :id AND store_id = :store_id
        """
        params = {"id": id, "store_id": user.store_id}

    with engine.connect() as conn:
        result = conn.execute(text(query), params)
        conn.commit()

    if result.rowcount == 0:
        raise HTTPException(status_code=403, detail="Not allowed or product not found")

    return {"message": "Product deleted"}







#------------------ City-Dashboard(Role-Aware)---------------
from fastapi import Depends, HTTPException
from app.dependencies import get_current_user
from app.guards import admin_only
import pandas as pd

@app.get("/api/sales/cities/summary")
def city_summary(user=Depends(get_current_user)):

    admin_only(user)

    try:
        df = pd.read_sql("""
            SELECT 
                city,
                COUNT(DISTINCT store_id) AS totalStores,
                COALESCE(SUM(units_sold), 0) AS totalUnitsSold,
                COALESCE(SUM(inventory_level), 0) AS totalInventory
            FROM inventory_data
            WHERE city IS NOT NULL
              AND date >= (
                  SELECT MAX(date) FROM inventory_data
              ) - INTERVAL 30 DAY
            GROUP BY city
        """, engine)

        return df.to_dict(orient="records")

    except Exception as e:
        print("CITY SUMMARY ERROR:", e)
        raise HTTPException(status_code=500, detail="City summary fetch failed")



#-------------------- Store Dashboard(Role-Aware)------------------------
from fastapi import Depends
from app.dependencies import get_current_user
from app.guards import admin_or_own_store
import pandas as pd
from sqlalchemy import text

@app.get("/api/sales/city/{city}/stores")
def get_stores_by_city(city: str, user=Depends(get_current_user)):

    # 🔐 Authorization:
    # - Admin: allowed for any store
    # - Manager: allowed ONLY for their own store
    #   (we’ll enforce store-level access below)

    if user.role == "admin":
        query = """
            SELECT store_id AS StoreID,
                   SUM(units_sold) AS totalUnitsSold,
                   SUM(inventory_level) AS totalInventory
            FROM inventory_data
            WHERE city = :city
            GROUP BY store_id
        """
        params = {"city": city}

    else:
        # Manager: only their own store
        admin_or_own_store(user, user.store_id)

        query = """
            SELECT store_id AS StoreID,
                   SUM(units_sold) AS totalUnitsSold,
                   SUM(inventory_level) AS totalInventory
            FROM inventory_data
            WHERE city = :city AND store_id = :store_id
            GROUP BY store_id
        """
        params = {
            "city": city,
            "store_id": user.store_id
        }

    df = pd.read_sql(text(query), engine, params=params)
    df = df.where(pd.notnull(df), None)

    return df.to_dict(orient="records")










#-------------------------------------------------------------------------------------------------------
from fastapi import Depends
from app.dependencies import get_current_user

@app.get("/api/me")
def get_me(user=Depends(get_current_user)):
    return {
        "email": user.email,
        "role": user.role,
        "city": user.city,
        "store_id": user.store_id
    }
#------------------------------------------------------------------------------------------------------

#------------------------ Deployment Testing-----------------
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SmartStock Backend",
        "deployment": "successful"
    }
