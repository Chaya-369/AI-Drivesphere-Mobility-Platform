from pymongo import MongoClient

def lower_earnings():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["drivesphere"]
    bookings = db["bookings"]

    # Lower the amounts for the demo owner's bookings
    bookings.update_one({"bookingId": "DS992122"}, {"$set": {"totalAmount": "₹3500"}})
    bookings.update_one({"bookingId": "DS992123"}, {"$set": {"totalAmount": "₹4200"}})
    bookings.update_one({"bookingId": "DS992124"}, {"$set": {"totalAmount": "₹2800"}})
    bookings.update_one({"bookingId": "DS992125"}, {"$set": {"totalAmount": "₹3000"}})
    
    print("Lowered the totalAmount of the demo owner's bookings.")

if __name__ == "__main__":
    lower_earnings()
