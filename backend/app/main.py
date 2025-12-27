from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import pandas as pd

from app.database import engine
from app.ml.predictor import predict_units
from app.ml.alerts import generate_alerts
from app.chatbot import chatbot_response

app = FastAPI(title="SmartStock Backend")

# -------------------- CORS --------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://127.0.0.1:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------- PRODUCTS --------------------

# @app.get("/api/products/all")
# def get_all_products():
#     try:
#         df = pd.read_sql("SELECT * FROM inventory_data LIMIT 2000", engine)
#         df = df.where(pd.notnull(df), None)
#         return {"products": df.to_dict(orient="records")}
#     except Exception as e:
#         print("Fetch Error:", e)
#         raise HTTPException(status_code=500, detail="DB fetch failed")


# @app.get("/api/products/{id}")
# def get_product(id: int):
#     df = pd.read_sql(
#         text("SELECT * FROM inventory_data WHERE id=:id"),
#         engine,
#         params={"id": id}
#     )
#     if df.empty:
#         raise HTTPException(status_code=404, detail="Product not found")
#     return {"product": df.iloc[0].to_dict()}


# @app.post("/api/products")
# def add_product(product: dict = Body(...)):
#     query = text("""
#         INSERT INTO inventory_data
#         (product_id, category, inventory_level, price)
#         VALUES (:product_id, :category, :inventory_level, :price)
#     """)
#     with engine.connect() as conn:
#         conn.execute(query, product)
#         conn.commit()
#     return {"message": "Product added successfully"}



# @app.put("/api/products/{id}")
# def update_product(id: int, product: dict = Body(...)):
#     try:
#         # Basic validation
#         if "category" not in product:
#             raise HTTPException(status_code=400, detail="Category is required")

#         if "inventory_level" not in product or product["inventory_level"] < 0:
#             raise HTTPException(status_code=400, detail="Invalid inventory level")

#         if "price" not in product or product["price"] <= 0:
#             raise HTTPException(status_code=400, detail="Invalid price")

#         query = text("""
#             UPDATE inventory_data
#             SET category = :category,
#                 inventory_level = :inventory_level,
#                 price = :price
#             WHERE id = :id
#         """)

#         with engine.connect() as conn:
#             result = conn.execute(query, {
#                 "category": product["category"],
#                 "inventory_level": product["inventory_level"],
#                 "price": product["price"],
#                 "id": id
#             })
#             conn.commit()

#         if result.rowcount == 0:
#             raise HTTPException(status_code=404, detail="Product not found")

#         return {"message": "Product updated successfully"}

#     except HTTPException:
#         raise
#     except Exception as e:
#         print("🔥 UPDATE ERROR:", e)
#         raise HTTPException(status_code=500, detail="Failed to update product")


# @app.delete("/api/products/{id}")
# def delete_product(id: int):
#     with engine.connect() as conn:
#         result = conn.execute(
#             text("DELETE FROM inventory_data WHERE id=:id"),
#             {"id": id}
#         )
#         conn.commit()

#     if result.rowcount == 0:
#         raise HTTPException(status_code=404, detail="Product not found")

#     return {"message": "Product deleted"}

# -------------------- ML --------------------

@app.get("/predict")
def predict(store_id: str, product_id: str):
    print("PREDICT REQUEST RECEIVED:", store_id, product_id)
    return predict_units(store_id, product_id)


@app.get("/alerts")
def alerts():
    return generate_alerts()

# -------------------- CHATBOT --------------------

@app.post("/chat")
def chat(message: str = Body(..., embed=True)):
    return {"reply": chatbot_response(message)}



#------------------- City-Dashboard----------------

# from fastapi import FastAPI
# from sqlalchemy import text
# from app.database import engine

# @app.get("/city-dashboard")
# def city_dashboard():
#     query = """
#         SELECT 
#   city,
#   COUNT(DISTINCT store_id) AS totalStores,
#   SUM(units_sold) AS totalUnitsSold,
#   SUM(inventory_level) AS totalInventory
# FROM inventory_data
# WHERE date >= (
#   SELECT MAX(date) FROM inventory_data
# ) - INTERVAL 30 DAY
# GROUP BY city;


#     """

#     with engine.connect() as conn:
#         result = conn.execute(text(query))
#         rows = result.fetchall()

#     data = []
#     for row in rows:
#         data.append({
#             "city": row.city,
#             "totalStores": int(row.totalStores or 0),
#             "totalUnitsSold": int(row.totalUnitsSold or 0),
#             "totalInventory": int(row.totalInventory or 0)
#         })

#     return data


#-------------------- Store-Dashboard--------------
# @app.get("/stores-by-city")
# def stores_by_city(city: str):
#     query = """
#         SELECT 
#   store_id,
#   SUM(units_sold) AS totalUnitsSold,
#   SUM(inventory_level) AS totalInventory
# FROM inventory_data
# WHERE city = %s
# AND date >= (
#   SELECT MAX(date) FROM inventory_data
# ) - INTERVAL 30 DAY
# GROUP BY store_id;


#     """

#     df = pd.read_sql(query, engine, params=(city,))

#     return [
#         {
#             "StoreID": row["store_id"],
#             "storeName": f"{city.title()} Store {row['store_id']}",
#             "totalUnitsSold": int(row["totalUnitsSold"]),
#             "totalInventory": int(row["totalInventory"])
#         }
#         for _, row in df.iterrows()
#     ]




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
from fastapi import Depends
from app.dependencies import get_current_user
from app.guards import admin_only

@app.get("/api/sales/cities/summary")
def city_summary(user=Depends(get_current_user)):

    # 🔐 ADMIN ONLY
    admin_only(user)

    # ---- existing logic stays the same below ----
    df = pd.read_sql("""
        SELECT city,
               COUNT(DISTINCT store_id) AS totalStores,
               SUM(units_sold) AS totalUnitsSold,
               SUM(inventory_level) AS totalInventory
        FROM inventory_data
        GROUP BY city
    """, engine)

    df = df.where(pd.notnull(df), None)
    return df.to_dict(orient="records")

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

