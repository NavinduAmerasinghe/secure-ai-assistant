from app.core.database import SessionLocal
from app.models.explanation import Explanation

def clear_explanations():
    db = SessionLocal()
    try:
        num_deleted = db.query(Explanation).delete()
        db.commit()
        print(f"Deleted {num_deleted} explanations.")
    finally:
        db.close()

if __name__ == "__main__":
    clear_explanations()
