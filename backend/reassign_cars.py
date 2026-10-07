from pymongo import MongoClient

def reassign_cars():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["drivesphere"]
    
    cars_collection = db["cars"]
    bookings_collection = db["bookings"]

    # 1. Delete the 3 cars I manually added
    cars_to_delete = ["Mercedes-Benz G-Class", "BMW M4 Competition", "Range Rover Sport"]
    cars_collection.delete_many({"name": {"$in": cars_to_delete}})

    # 2. Assign 3 existing cars to 'demo_owner'
    cars_to_assign = ["Hyundai Creta", "Mahindra Thar", "Tata Nexon"]
    cars_collection.update_many(
        {"name": {"$in": cars_to_assign}},
        {"$set": {"ownerId": "demo_owner"}}
    )

    # 3. Update the seeded bookings to match the newly assigned cars
    # We will just sequentially update the 4 bookings we know belong to demo_owner
    demo_bookings = list(bookings_collection.find({"ownerId": "demo_owner"}))
    
    if len(demo_bookings) >= 4:
        bookings_collection.update_one({"_id": demo_bookings[0]["_id"]}, {"$set": {"carName": "Hyundai Creta"}})
        bookings_collection.update_one({"_id": demo_bookings[1]["_id"]}, {"$set": {"carName": "Mahindra Thar"}})
        bookings_collection.update_one({"_id": demo_bookings[2]["_id"]}, {"$set": {"carName": "Tata Nexon"}})
        bookings_collection.update_one({"_id": demo_bookings[3]["_id"]}, {"$set": {"carName": "Hyundai Creta"}})

    print("Successfully removed added cars and assigned existing ones!")

if __name__ == "__main__":
    reassign_cars()
