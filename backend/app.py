from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import random
import json
import io
from bson import ObjectId
from twilio.rest import Client
import google.generativeai as genai
from PIL import Image

load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["drivesphere"]
cars_collection = db["cars"]
users_collection = db["users"]
bookings_collection = db["bookings"]
reviews_collection = db["reviews"]
tickets_collection = db["tickets"]

otp_store = {}
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@app.route("/")
def home():
    return jsonify({"message": "DriveSphere Backend Running Successfully"})

@app.route("/api/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    phone_number = data.get("phoneNumber")
    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400
        
    otp = str(random.randint(100000, 999999))
    otp_store[phone_number] = otp
    
    if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER:
        try:
            client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=f"Your DriveSphere Keyless Unlock OTP is: {otp}. Do not share this with anyone.",
                from_=TWILIO_PHONE_NUMBER,
                to=phone_number
            )
            return jsonify({"message": "OTP sent successfully", "sid": message.sid}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        # Fallback if twilio is not configured
        print(f"--- DEMO OTP for {phone_number}: {otp} ---")
        return jsonify({"message": "Twilio not configured. OTP printed to backend console."}), 200

@app.route("/api/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    phone_number = data.get("phoneNumber")
    otp = data.get("otp")
    
    if not phone_number or not otp:
        return jsonify({"error": "Phone number and OTP are required"}), 400
        
    if otp_store.get(phone_number) == otp:
        del otp_store[phone_number] # remove after successful use
        return jsonify({"success": True, "message": "OTP verified successfully"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid or expired OTP"}), 400

@app.route("/api/analyze-damage", methods=["POST"])
def analyze_damage():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400
            
        file = request.files['image']
        selected_car = request.form.get("selectedCar", "Unknown Car")
        
        img = Image.open(file.stream)
        
        prompt = f"""
        Act as an expert auto body shop appraiser in India. You are analyzing an image of a {selected_car}.
        Analyze the image very carefully. Tell me if there are any scratches, dents, or structural damage.
        You MUST respond ONLY with a valid JSON object matching exactly this schema, without any markdown formatting:
        {{
            "status": "Damage Detected" or "No Damage Detected" or "Severe Damage Detected",
            "confidence": "98%", 
            "details": "Describe the damage exactly as seen, mentioning the {selected_car}",
            "severity": "None", "Low", "Medium", or "High",
            "actual_repair_cost_inr": <number representing the ACTUAL real-world estimated repair cost for a {selected_car} in INR without commas>
        }}
        """
        
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content([prompt, img])
        
        resp_text = response.text.strip()
        if resp_text.startswith("```json"):
            resp_text = resp_text[7:]
        if resp_text.endswith("```"):
            resp_text = resp_text[:-3]
            
        result = json.loads(resp_text)
        
        actual_cost = int(result.get("actual_repair_cost_inr", 0))
        
        if actual_cost == 0:
            result["estimatedCost"] = "₹0"
        else:
            # Create a realistic range, e.g., 20% variance
            upper_bound = int(actual_cost * 1.2)
            result["estimatedCost"] = f"₹{actual_cost:,} - ₹{upper_bound:,}"
            
        return jsonify(result), 200
    except Exception as e:
        print(f"Vision API Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to analyze image: {str(e)}"}), 500

@app.route("/api/cars", methods=["GET"])
def get_cars():
    cars = []
    for car in cars_collection.find():
        cars.append({
            "id": str(car["_id"]),
            "name": car.get("name", "Unknown Car"),
            "brand": car.get("brand", "Unknown Brand"),
            "type": car.get("type", "Car"),
            "fuel": car.get("fuel", "Petrol"),
            "price": car.get("price", 0),
            "location": car.get("location", "Bangalore"),
            "image": car.get("image", "https://images.unsplash.com/photo-1503376780353-7e6692767b70"),
            "rating": car.get("rating", 4.5),
            "availability": car.get("availability", "Available"),
            "ownerName": car.get("ownerName", "DriveSphere Partner"),
            "ownerId": car.get("ownerId", "partner_001")
        })
    return jsonify(cars)

@app.route("/api/cars/add", methods=["POST"])
def add_car():
    data = request.json

    new_car = {
        "name": data["name"],
        "brand": data["brand"],
        "type": data["type"],
        "fuel": data["fuel"],
        "price": data["price"],
        "location": data["location"],
        "image": data["image"],
        "rating": data.get("rating", 4.5),
        "availability": car.get("availability", "Available")
    }

    cars_collection.insert_one(new_car)
    return jsonify({"message": "Car added successfully"})
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json

    existing_user = users_collection.find_one({"email": data["email"]})

    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    new_user = {
        "name": data["name"],
        "email": data["email"],
        "password": data["password"],
        "role": data["role"]
    }

    users_collection.insert_one(new_user)

    return jsonify({"message": "Signup successful"})
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json

    user = users_collection.find_one({
        "email": data["email"],
        "password": data["password"]
    })

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    })
@app.route("/api/bookings/add", methods=["POST"])
def add_booking():
    data = request.json

    import random
    import string
    booking_id = "DS" + "".join(random.choices(string.digits, k=6))

    new_booking = {
        "bookingId": booking_id,
        "userName": data.get("userName", "Guest User"),
        "carName": data.get("carName"),
        "startDate": data.get("startDate"),
        "endDate": data.get("endDate"),
        "pickupLocation": data.get("pickupLocation"),
        "method": data.get("method"),
        "amountPaid": data.get("amountPaid"),
        "totalAmount": data.get("totalAmount"),
        "status": "Confirmed"
    }

    bookings_collection.insert_one(new_booking)

    # Convert ObjectId to string for JSON serialization
    new_booking["_id"] = str(new_booking["_id"])

    return jsonify({"message": "Booking request sent successfully", "booking": new_booking})

@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    bookings = []

    for booking in bookings_collection.find():
        bookings.append({
            "id": str(booking["_id"]),
            "userName": booking["userName"],
            "carName": booking["carName"],
            "startDate": booking["startDate"],
            "endDate": booking["endDate"],
            "pickupLocation": booking["pickupLocation"],
            "status": booking["status"]
        })

    return jsonify(bookings)

@app.route("/api/reviews/add", methods=["POST"])
def add_review():
    data = request.json

    new_review = {
        "carName": data["carName"],
        "userName": data["userName"],
        "rating": data["rating"],
        "comment": data["comment"]
    }

    reviews_collection.insert_one(new_review)

    return jsonify({"message": "Review added successfully"})

@app.route("/api/owner/stats", methods=["GET"])
def owner_stats():
    total_cars = cars_collection.count_documents({})
    total_bookings = bookings_collection.count_documents({})
    total_earnings = total_bookings * 2500

    return jsonify({
        "totalCars": total_cars,
        "totalBookings": total_bookings,
        "totalEarnings": total_earnings
    })

@app.route("/api/bookings/status/<booking_id>", methods=["PUT"])
def update_booking_status(booking_id):
    data = request.json

    bookings_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": data["status"]}}
    )

    return jsonify({"message": "Booking status updated"})

@app.route("/api/cars/seed", methods=["POST"])
def seed_cars():
    cars_collection.delete_many({})

    sample_cars = [
       {"name":"Hyundai Creta","brand":"Hyundai","type":"SUV","fuel":"Petrol","price":1499,"location":"Bangalore","image":"/src/assets/cars/hyundai-creta.png","rating":4.8,"availability":"Available"},
{"name":"Toyota Innova","brand":"Toyota","type":"MPV","fuel":"Diesel","price":1699,"location":"Mysore","image":"/src/assets/cars/toyota-innova.png","rating":4.9,"availability":"Available"},
{"name":"Mahindra Thar","brand":"Mahindra","type":"SUV","fuel":"Diesel","price":1999,"location":"Goa","image":"/src/assets/cars/mahindra-thar.png","rating":4.8,"availability":"Available"},
{"name":"BMW X5","brand":"BMW","type":"Luxury SUV","fuel":"Diesel","price":4499,"location":"Mumbai","image":"/src/assets/cars/bmw-x5.png","rating":5.0,"availability":"Available"},
{"name":"Audi A4","brand":"Audi","type":"Sedan","fuel":"Petrol","price":3499,"location":"Delhi","image":"/src/assets/cars/audi-a4.png","rating":4.7,"availability":"Available"},
{"name":"Honda City","brand":"Honda","type":"Sedan","fuel":"Petrol","price":1299,"location":"Hyderabad","image":"/src/assets/cars/honda-city.png","rating":4.6,"availability":"Available"},
{"name":"Kia Seltos","brand":"Kia","type":"SUV","fuel":"Diesel","price":1599,"location":"Chennai","image":"/src/assets/cars/kia-seltos.png","rating":4.7,"availability":"Available"},
{"name":"Maruti Swift","brand":"Maruti","type":"Hatchback","fuel":"Petrol","price":699,"location":"Pune","image":"/src/assets/cars/maruti-swift.png","rating":4.5,"availability":"Available"},
{"name":"Hyundai i20","brand":"Hyundai","type":"Hatchback","fuel":"Petrol","price":799,"location":"Bangalore","image":"/src/assets/cars/hyundai-i20.png","rating":4.5,"availability":"Available"},
{"name":"Tata Nexon EV","brand":"Tata","type":"EV SUV","fuel":"Electric","price":1599,"location":"Delhi","image":"/src/assets/cars/tata-nexon-ev.png","rating":4.9,"availability":"Available"},
{"name":"MG ZS EV","brand":"MG","type":"EV SUV","fuel":"Electric","price":2599,"location":"Mumbai","image":"/src/assets/cars/mg-zs-ev.png","rating":4.8,"availability":"Available"},
{"name":"Hyundai Kona EV","brand":"Hyundai","type":"EV SUV","fuel":"Electric","price":2199,"location":"Pune","image":"/src/assets/cars/hyundai-kona-ev.png","rating":4.7,"availability":"Available"},
{"name":"Skoda Superb","brand":"Skoda","type":"Luxury Sedan","fuel":"Petrol","price":2299,"location":"Chennai","image":"/src/assets/cars/skoda-superb.png","rating":4.8,"availability":"Available"},
{"name":"Range Rover","brand":"Land Rover","type":"Luxury SUV","fuel":"Diesel","price":6999,"location":"Bangalore","image":"/src/assets/cars/range-rover.png","rating":5.0,"availability":"Available"},
{"name":"Mercedes GLC","brand":"Mercedes","type":"Luxury SUV","fuel":"Petrol","price":4999,"location":"Delhi","image":"/src/assets/cars/mercedes-glc.png","rating":4.9,"availability":"Available"},
{"name":"Mahindra XUV400","brand":"Mahindra","type":"EV SUV","fuel":"Electric","price":1899,"location":"Hyderabad","image":"/src/assets/cars/mahindra-xuv400.png","rating":4.6,"availability":"Available"},
{"name":"Maruti Ertiga","brand":"Maruti","type":"MPV","fuel":"Petrol","price":1299,"location":"Kolkata","image":"/src/assets/cars/maruti-ertiga.png","rating":4.4,"availability":"Available"},
{"name":"Tata Harrier","brand":"Tata","type":"SUV","fuel":"Diesel","price":1799,"location":"Jaipur","image":"/src/assets/cars/tata-harrier.png","rating":4.7,"availability":"Available"},
{"name":"Tata Nexon","brand":"Tata","type":"SUV","fuel":"Petrol","price":1399,"location":"Ahmedabad","image":"/src/assets/cars/tata-nexon.png","rating":4.5,"availability":"Available"},
{"name":"Tiago","brand":"Tata","type":"Hatchback","fuel":"Petrol","price":649,"location":"Lucknow","image":"/src/assets/cars/tiago.png","rating":4.3,"availability":"Available"},
{"name":"Alto","brand":"Maruti","type":"Hatchback","fuel":"Petrol","price":499,"location":"Mangalore","image":"/src/assets/cars/alto.png","rating":4.2,"availability":"Available"},
{"name":"WagonR","brand":"Maruti","type":"Hatchback","fuel":"Petrol","price":599,"location":"Bangalore","image":"/src/assets/cars/wagonr.png","rating":4.4,"availability":"Available"},
        {
    "name":"Maruti Alto",
    "brand":"Maruti",
    "type":"Budget Hatchback",
    "fuel":"Petrol",
    "price":499,
    "location":"Bangalore",
    "image":"alto",
    "rating":4.2,
    "availability":"Available"
},

{
    "name":"Renault Kwid",
    "brand":"Renault",
    "type":"Budget Hatchback",
    "fuel":"Petrol",
    "price":549,
    "location":"Mysore",
    "image":"kwid",
    "rating":4.3,
    "availability":"Available"
},

{
    "name":"WagonR",
    "brand":"Maruti",
    "type":"Family Hatchback",
    "fuel":"Petrol",
    "price":599,
    "location":"Bangalore",
    "image":"wagonr",
    "rating":4.4,
    "availability":"Available"
},

{
    "name":"Tata Tiago",
    "brand":"Tata",
    "type":"Budget Hatchback",
    "fuel":"Petrol",
    "price":649,
    "location":"Hyderabad",
    "image":"tiago",
    "rating":4.5,
    "availability":"Available"
},

{
    "name":"Hyundai Grand i10",
    "brand":"Hyundai",
    "type":"Compact Hatchback",
    "fuel":"Petrol",
    "price":749,
    "location":"Chennai",
    "image":"grandi10",
    "rating":4.4,
    "availability":"Available"
}
    ]

    cars_collection.insert_many(sample_cars)

    return jsonify({"message": "20 cars added successfully"})

# --- Admin Endpoints ---

@app.route("/api/admin/users", methods=["GET"])
def admin_get_users():
    users = []
    for user in users_collection.find():
        users.append({
            "id": str(user["_id"]),
            "name": user.get("name", "Unknown"),
            "email": user.get("email", "Unknown"),
            "role": user.get("role", "user")
        })
    return jsonify(users)

@app.route("/api/admin/users/<user_id>", methods=["DELETE"])
def admin_delete_user(user_id):
    users_collection.delete_one({"_id": ObjectId(user_id)})
    return jsonify({"message": "User deleted successfully"})

@app.route("/api/admin/cars", methods=["GET"])
def admin_get_cars():
    cars = []
    for car in cars_collection.find():
        cars.append({
            "id": str(car["_id"]),
            "name": car.get("name", "Unknown Car"),
            "brand": car.get("brand", "Unknown Brand"),
            "type": car.get("type", "Car"),
            "price": car.get("price", 0),
            "status": car.get("status", "Approved")
        })
    return jsonify(cars)

@app.route("/api/admin/cars/<car_id>/status", methods=["PUT"])
def admin_update_car_status(car_id):
    data = request.json
    cars_collection.update_one(
        {"_id": ObjectId(car_id)},
        {"$set": {"status": data["status"]}}
    )
    return jsonify({"message": "Car status updated"})

@app.route("/api/admin/cars/<car_id>", methods=["DELETE"])
def admin_delete_car(car_id):
    cars_collection.delete_one({"_id": ObjectId(car_id)})
    return jsonify({"message": "Car deleted successfully"})

@app.route("/api/admin/bookings", methods=["GET"])
def admin_get_bookings():
    bookings = []
    for booking in bookings_collection.find():
        bookings.append({
            "id": str(booking["_id"]),
            "userName": booking.get("userName", "Unknown"),
            "carName": booking.get("carName", "Unknown"),
            "startDate": booking.get("startDate", ""),
            "endDate": booking.get("endDate", ""),
            "status": booking.get("status", "Pending")
        })
    return jsonify(bookings)

@app.route("/api/admin/tickets", methods=["GET"])
def admin_get_tickets():
    tickets = []
    for ticket in tickets_collection.find():
        tickets.append({
            "id": str(ticket["_id"]),
            "user": ticket.get("user", "Unknown"),
            "issue": ticket.get("issue", "No details"),
            "status": ticket.get("status", "Open")
        })
    return jsonify(tickets)

@app.route("/api/admin/tickets/<ticket_id>/status", methods=["PUT"])
def admin_update_ticket_status(ticket_id):
    data = request.json
    tickets_collection.update_one(
        {"_id": ObjectId(ticket_id)},
        {"$set": {"status": data["status"]}}
    )
    return jsonify({"message": "Ticket status updated"})

@app.route("/api/admin/analytics", methods=["GET"])
def admin_analytics():
    total_users = users_collection.count_documents({})
    total_cars = cars_collection.count_documents({})
    
    all_bookings = list(bookings_collection.find({}))
    total_bookings = len(all_bookings)
    
    # Calculate real dynamic revenue
    total_revenue = 0
    for b in all_bookings:
        # Check for various price field names depending on how it was saved
        raw_price = b.get("totalAmount") or b.get("totalPrice") or b.get("price") or b.get("amount") or 0
        try:
            # Remove ₹ and commas if it's a string, then cast to float
            if isinstance(raw_price, str):
                price_str = raw_price.replace("₹", "").replace(",", "").strip()
                total_revenue += float(price_str)
            else:
                total_revenue += float(raw_price)
        except ValueError:
            pass
    
    # Mock AI Insights
    insights = [
        "Demand for SUVs has increased by 15% this month.",
        "Revenue is projected to grow by 8% next week.",
        "User retention has improved due to faster support responses."
    ]

    return jsonify({
        "totalUsers": total_users,
        "totalCars": total_cars,
        "totalBookings": total_bookings,
        "totalRevenue": total_revenue,
        "insights": insights
    })

@app.route("/api/tickets/add", methods=["POST"])
def add_ticket():
    data = request.json
    new_ticket = {
        "user": data.get("user", "Anonymous"),
        "issue": data.get("issue", "General Inquiry"),
        "status": "Open"
    }
    tickets_collection.insert_one(new_ticket)
    return jsonify({"message": "Ticket submitted successfully"})


# --- Owner Endpoints ---

@app.route("/api/owner/my-cars", methods=["GET"])
def owner_get_cars():
    owner_id = "demo_owner"
    cars = []
    # For demo, just return some cars, simulating they belong to "demo_owner"
    # To be realistic, we filter where ownerId == demo_owner or just return a limited subset.
    for car in cars_collection.find({"ownerId": owner_id}):
        cars.append({
            "id": str(car["_id"]),
            "name": car.get("name", "Unknown Car"),
            "brand": car.get("brand", "Unknown"),
            "price": car.get("price", 0),
            "image": car.get("image", ""),
            "status": car.get("status", "Active")
        })
    return jsonify(cars)

@app.route("/api/owner/my-cars/add", methods=["POST"])
def owner_add_car():
    data = request.json
    new_car = {
        "name": data.get("name"),
        "brand": data.get("brand"),
        "type": data.get("type", "Car"),
        "fuel": data.get("fuel", "Petrol"),
        "price": data.get("price"),
        "location": data.get("location", "Bangalore"),
        "image": data.get("image"),
        "rating": 5.0,
        "availability": "Available",
        "status": "Pending Approval",
        "ownerId": "demo_owner"
    }
    cars_collection.insert_one(new_car)
    return jsonify({"message": "Car added successfully"})

@app.route("/api/owner/my-bookings", methods=["GET"])
def owner_get_bookings():
    owner_id = "demo_owner"
    bookings = []
    for booking in bookings_collection.find({"ownerId": owner_id}):
        bookings.append({
            "id": str(booking["_id"]),
            "userName": booking.get("userName", "Unknown"),
            "carName": booking.get("carName", "Unknown"),
            "startDate": booking.get("startDate", ""),
            "endDate": booking.get("endDate", ""),
            "status": booking.get("status", "Pending")
        })
    return jsonify(bookings)

@app.route("/api/owner/my-bookings/<booking_id>/status", methods=["PUT"])
def owner_update_booking_status(booking_id):
    data = request.json
    bookings_collection.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": data["status"]}}
    )
    return jsonify({"message": f"Booking {data['status'].lower()} successfully"})

@app.route("/api/owner/my-analytics", methods=["GET"])
def owner_analytics():
    owner_id = "demo_owner"
    total_cars = cars_collection.count_documents({"ownerId": owner_id})
    total_bookings = bookings_collection.count_documents({"ownerId": owner_id})
    
    # Calculate real dynamic revenue
    revenue = 0
    confirmed = list(bookings_collection.find({"ownerId": owner_id, "status": "Confirmed"}))
    for b in confirmed:
        raw_price = b.get("totalAmount") or b.get("totalPrice") or b.get("price") or b.get("amount") or 0
        try:
            if isinstance(raw_price, str):
                price_str = raw_price.replace("₹", "").replace(",", "").strip()
                revenue += float(price_str)
            else:
                revenue += float(raw_price)
        except ValueError:
            pass

    # Calculate real usage stats dynamically
    usage_stats = []
    from collections import Counter
    car_usage = Counter(b.get("carName", "Unknown Car") for b in confirmed)
    for car_name, trips in car_usage.items():
        usage_stats.append({"car": car_name, "trips": trips})

    # Generate dynamic maintenance reminders for actual cars
    owner_cars = list(cars_collection.find({"ownerId": owner_id}))
    maintenance = []
    maintenance_issues = [
        {"issue": "Oil Change Due", "date": "Next Week"},
        {"issue": "Tire Rotation", "date": "In 2 Weeks"},
        {"issue": "Brake Inspection", "date": "Next Month"}
    ]
    
    for i, car in enumerate(owner_cars[:3]): # Add max 3 reminders
        issue_data = maintenance_issues[i % len(maintenance_issues)]
        maintenance.append({
            "car": car.get("name", "Vehicle"),
            "issue": issue_data["issue"],
            "date": issue_data["date"]
        })

    return jsonify({
        "totalCars": total_cars,
        "totalBookings": total_bookings,
        "totalRevenue": revenue,
        "rating": 4.8,
        "usage": usage_stats,
        "maintenance": maintenance
    })

if __name__ == "__main__":
    app.run(debug=True)