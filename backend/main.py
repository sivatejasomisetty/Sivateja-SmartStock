# # from fastapi import FastAPI, Body
# # from fastapi.middleware.cors import CORSMiddleware

# # from app.ml.predictor import predict_units
# # from app.ml.alerts import generate_alerts
# # from app.chatbot import chatbot_response

# # app = FastAPI(title="SmartStock Backend")

# # # -----------------------------
# # # CORS CONFIG (REQUIRED FOR REACT)
# # # -----------------------------
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["http://localhost:3000"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # -----------------------------
# # # ROOT
# # # -----------------------------
# # @app.get("/")
# # def root():
# #     return {"message": "SmartStock Backend Running"}

# # # -----------------------------
# # # PREDICTION API
# # # -----------------------------
# # @app.get("/predict")
# # def predict(store_id: str, product_id: str):
# #     return predict_units(store_id, product_id)

# # # -----------------------------
# # # ALERTS API
# # # -----------------------------
# # @app.get("/alerts")
# # def alerts():
# #     return generate_alerts()

# # # -----------------------------
# # # CHATBOT API (THIS WAS MISSING)
# # # -----------------------------
# # @app.post("/chat")
# # def chat(message: str = Body(..., embed=True)):
# #     return {
# #         "reply": chatbot_response(message)
# #     }










# # from fastapi import FastAPI, Body, HTTPException, Query
# # from fastapi.middleware.cors import CORSMiddleware
# # import pandas as pd
# # import uvicorn

# # # Import your custom modules
# # from app.ml.predictor import predict_units
# # from app.ml.alerts import generate_alerts
# # from app.chatbot import chatbot_response
# # from app.database import engine 

# # app = FastAPI(title="SmartStock Backend")

# # # -----------------------------
# # # CORS CONFIG (Allows React at port 3000 to connect)
# # # -----------------------------
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["http://localhost:3000"],
# #     allow_credentials=True,
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # # -----------------------------
# # # DASHBOARD API: Fetch data for React
# # # -----------------------------
# # @app.get("/api/products/all")
# # def get_dashboard_products():
# #     try:
# #         # Fetching directly from MySQL using your existing engine
# #         query = "SELECT * FROM inventory_data"
# #         df = pd.read_sql(query, engine)
        
# #         # Mapping column names if necessary to match your React 'p.quantity' etc.
# #         # If your DB columns are already named correctly, this isn't needed.
# #         products_list = df.to_dict(orient="records")
        
# #         return {"products": products_list}
# #     except Exception as e:
# #         print(f"Database Error: {e}")
# #         raise HTTPException(status_code=500, detail="Error fetching data from MySQL")

# # # -----------------------------
# # # PREDICTION API: XGBoost Logic
# # # -----------------------------
# # @app.get("/predict")
# # def predict(store_id: str, product_id: str):
# #     try:
# #         # Calls your predictor.py logic
# #         result = predict_units(store_id, product_id)
# #         return result
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))

# # # -----------------------------
# # # ALERTS & CHATBOT
# # # -----------------------------
# # @app.get("/alerts")
# # def alerts():
# #     return generate_alerts()

# # @app.post("/chat")
# # def chat(message: str = Body(..., embed=True)):
# #     return {"reply": chatbot_response(message)}

# # @app.get("/")
# # def root():
# #     return {"message": "SmartStock Backend Running"}

# # if __name__ == "__main__":
# #     uvicorn.run(app, host="0.0.0.0", port=8000)








from fastapi import FastAPI, Body, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
import pandas as pd
import uvicorn

# Import your existing modules
from app.ml.predictor import predict_units
from app.ml.alerts import generate_alerts
from app.chatbot import chatbot_response
from app.database import engine 

app = FastAPI(title="SmartStock Backend")

# CORS CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------
# PRODUCTS API ENDPOINTS
# -------------------------------------------------

@app.get("/api/products/all")
def get_all_products():
    """Fetches all inventory items from MySQL for the table view."""
    try:
        query = "SELECT * FROM inventory_data"
        df = pd.read_sql(query, engine)
        
        # Replace NaN with None so JSON encoding doesn't fail
        df = df.where(pd.notnull(df), None)
        
        products_list = df.to_dict(orient="records")
        return {"products": products_list}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Database fetch failed")

@app.delete("/api/products/{id}")
def delete_product(id: int):
    """Deletes a product from MySQL based on the unique ID."""
    try:
        with engine.connect() as connection:
            # Using SQLAlchemy text() to prevent SQL injection
            query = text("DELETE FROM inventory_data WHERE id = :id")
            result = connection.execute(query, {"id": id})
            connection.commit()
            
            if result.rowcount == 0:
                raise HTTPException(status_code=404, detail="Product not found")
                
        return {"message": f"Product {id} deleted successfully"}
    except Exception as e:
        print(f"Delete Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete product")

# -------------------------------------------------
# ML & CHATBOT ENDPOINTS
# -------------------------------------------------

@app.get("/predict")
def predict(store_id: str, product_id: str):
    return predict_units(store_id, product_id)

@app.get("/alerts")
def alerts():
    return generate_alerts()

@app.post("/chat")
def chat(message: str = Body(..., embed=True)):
    return {"reply": chatbot_response(message)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)