from pymongo import MongoClient

def clean_db():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["drivesphere"]
    bookings_collection = db["bookings"]

    # Delete all documents where carName is null, empty string, or missing
    query = {"$or": [
        {"carName": None},
        {"carName": ""},
        {"carName": {"$exists": False}},
        {"startDate": None},
        {"startDate": ""}
    ]}

    result = bookings_collection.delete_many(query)
    print(f"Successfully deleted {result.deleted_count} junk bookings from MongoDB!")

if __name__ == "__main__":
    clean_db()
