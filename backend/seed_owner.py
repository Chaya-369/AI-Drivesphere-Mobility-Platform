from pymongo import MongoClient

def seed_owner_data():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["drivesphere"]
    
    # 1. Add Cars
    cars = [
        {
            "name": "Mercedes-Benz G-Class",
            "brand": "Mercedes",
            "price": "15000",
            "image": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800",
            "type": "Luxury SUV",
            "status": "Active",
            "ownerId": "demo_owner",
            "location": "Bengaluru Center"
        },
        {
            "name": "BMW M4 Competition",
            "brand": "BMW",
            "price": "12000",
            "image": "https://images.unsplash.com/photo-1618151313451-ea2a4f44053c?auto=format&fit=crop&q=80&w=800",
            "type": "Sports Coupe",
            "status": "Active",
            "ownerId": "demo_owner",
            "location": "Bengaluru Center"
        },
        {
            "name": "Range Rover Sport",
            "brand": "Land Rover",
            "price": "14000",
            "image": "https://images.unsplash.com/photo-1606016159991-d17b6748e58a?auto=format&fit=crop&q=80&w=800",
            "type": "SUV",
            "status": "Active",
            "ownerId": "demo_owner",
            "location": "Bengaluru Center"
        }
    ]
    
    # Insert cars
    db.cars.insert_many(cars)
    
    # 2. Add Bookings
    bookings = [
        {
            "bookingId": "DS992122",
            "userName": "Ramesh Kumar",
            "carName": "Mercedes-Benz G-Class",
            "startDate": "2026-05-20",
            "endDate": "2026-05-22",
            "pickupLocation": "Bengaluru Center",
            "status": "Confirmed",
            "totalAmount": "₹30000",
            "ownerId": "demo_owner"
        },
        {
            "bookingId": "DS992123",
            "userName": "Priya Sharma",
            "carName": "BMW M4 Competition",
            "startDate": "2026-05-23",
            "endDate": "2026-05-25",
            "pickupLocation": "Bengaluru Center",
            "status": "Confirmed",
            "totalAmount": "₹36000",
            "ownerId": "demo_owner"
        },
        {
            "bookingId": "DS992124",
            "userName": "Arjun Reddy",
            "carName": "Range Rover Sport",
            "startDate": "2026-05-26",
            "endDate": "2026-05-28",
            "pickupLocation": "Bengaluru Center",
            "status": "Confirmed",
            "totalAmount": "₹28000",
            "ownerId": "demo_owner"
        },
        {
            "bookingId": "DS992125",
            "userName": "Sneha Iyer",
            "carName": "Mercedes-Benz G-Class",
            "startDate": "2026-05-29",
            "endDate": "2026-05-31",
            "pickupLocation": "Bengaluru Center",
            "status": "Pending",
            "totalAmount": "₹30000",
            "ownerId": "demo_owner"
        }
    ]
    
    db.bookings.insert_many(bookings)
    print("Successfully seeded 3 cars and 4 bookings for demo_owner!")

if __name__ == "__main__":
    seed_owner_data()
