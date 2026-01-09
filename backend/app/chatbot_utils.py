# import pandas as pd
# from app.database import engine


# def get_stock_fast(product: str, store: str = None):
#     """
#     Fast stock lookup for chatbot (MySQL compatible).
#     """

#     if not product:
#         return []

#     if store:
#         sql = """
#             SELECT
#                 product_id,
#                 name,
#                 store_id,
#                 inventory_level
#             FROM inventory_data
#             WHERE LOWER(name) LIKE LOWER(%s)
#               AND store_id = %s
#         """
#         params = (f"%{product}%", store)
#     else:
#         sql = """
#             SELECT
#                 product_id,
#                 name,
#                 store_id,
#                 inventory_level
#             FROM inventory_data
#             WHERE LOWER(name) LIKE LOWER(%s)
#         """
#         params = (f"%{product}%",)

#     df = pd.read_sql(sql, engine, params=params)

#     if df.empty:
#         return []

#     return df.to_dict(orient="records")












# app/chatbot_utils.py

import pandas as pd
from app.database import engine


def get_stock_by_product_name(product_query: str, store: str = None):
    """
    Fetch stock using product_name column.
    """

    if not product_query:
        return []

    base_sql = """
        SELECT
            product_id,
            product_name,
            store_id,
            inventory_level
        FROM inventory_data
        WHERE LOWER(product_name) LIKE LOWER(%s)
    """

    params = [f"%{product_query}%"]

    if store:
        base_sql += " AND store_id = %s"
        params.append(store)

    df = pd.read_sql(base_sql, engine, params=tuple(params))

    if df.empty:
        return []

    return df.to_dict(orient="records")
