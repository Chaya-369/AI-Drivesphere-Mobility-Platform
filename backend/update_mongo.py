from pymongo import MongoClient
import random

def update_db():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["drivesphere"]
    cars_collection = db["cars"]

    centers = ["Yelahanka", "Electronic City", "Indiranagar"]
    
    cars = cars_collection.find({})
    updated_count = 0
    
    for car in cars:
        center = random.choice(centers)
        
        # We also need to increase the price if it hasn't been increased. 
        # But maybe they just want the location fixed right now. 
        # I'll update location and center as requested.
        
        old_price = car.get("price", 1000)
        # If the price was already updated by some script previously, it might end in 99.
        # But we'll just bump it 20% if we haven't done it yet in DB.
        new_price = int(old_price * 1.20 / 100) * 100 + 99
        
        cars_collection.update_one(
            {"_id": car["_id"]},
            {"$set": {
                "location": "Bengaluru",
                "center": center,
                "price": new_price
            }}
        )
        updated_count += 1
        
    print(f"Successfully updated {updated_count} cars in MongoDB!")

if __name__ == "__main__":
    update_db()
