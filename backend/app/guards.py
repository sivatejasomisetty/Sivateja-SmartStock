from fastapi import HTTPException

def admin_only(user):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")


def admin_or_own_store(user, store_id: str):
    if user.role == "admin":
        return

    if user.store_id != store_id:
        raise HTTPException(status_code=403, detail="Access denied for this store")
