import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OwnerDashboard.css";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    cars: [],
    bookings: [],
    analytics: null,
  });
  const [loading, setLoading] = useState(true);
  
  // New car form state
  const [newCar, setNewCar] = useState({ name: "", brand: "", price: "", image: "", type: "Car" });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [carsRes, bookingsRes, analyticsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/owner/my-cars"),
        axios.get("http://localhost:5000/api/owner/my-bookings"),
        axios.get("http://localhost:5000/api/owner/my-analytics"),
      ]);
      setData({
        cars: carsRes.data,
        bookings: bookingsRes.data,
        analytics: analyticsRes.data,
      });
    } catch (error) {
      console.error("Failed to fetch owner data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Security check: Only allow 'Car Owner' role
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Car Owner") {
      navigate("/home");
      return;
    }

    fetchAllData();
  }, [navigate]);

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/owner/my-cars/add", newCar);
      setNewCar({ name: "", brand: "", price: "", image: "", type: "Car" });
      fetchAllData();
      setActiveTab("fleet");
    } catch (error) {
      console.error("Failed to add car:", error);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/owner/my-bookings/${id}/status`, { status });
      fetchAllData();
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  if (loading) return <div className="owner-dashboard loading">Loading Dashboard...</div>;

  return (
    <div className="owner-dashboard">
      <div className="owner-sidebar">
        <div className="owner-logo"> Owner Portal</div>
        <button className="sidebar-btn" onClick={() => navigate(-1)} style={{ marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>⬅️ Back</button>
        <button className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}> Overview & Earnings</button>
        <button className={`sidebar-btn ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => setActiveTab('fleet')}> My Fleet</button>
        <button className={`sidebar-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}> Add Car</button>
        <button className={`sidebar-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}> Booking Requests</button>
        <button className={`sidebar-btn ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}> Availability Calendar</button>
      </div>

      <div className="owner-main">
        <div className="owner-header">
          <h1>
            {activeTab === 'overview' && 'Earnings & Analytics'}
            {activeTab === 'fleet' && 'My Fleet & Maintenance'}
            {activeTab === 'add' && 'List a New Car'}
            {activeTab === 'requests' && 'Customer Booking Requests'}
            {activeTab === 'calendar' && 'Availability Calendar'}
          </h1>
        </div>

        {activeTab === "overview" && data.analytics && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <p>Total Cars Listed</p>
                <h2>{data.analytics.totalCars}</h2>
              </div>
              <div className="stat-card">
                <p>Total Bookings</p>
                <h2>{data.analytics.totalBookings}</h2>
              </div>
              <div className="stat-card">
                <p>Total Earnings</p>
                <h2>₹{data.analytics.totalRevenue.toLocaleString()}</h2>
              </div>
              <div className="stat-card">
                <p>Average Rating</p>
                <h2>{data.analytics.rating} ⭐</h2>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <h3> Customer Usage Tracking</h3>
                <ul>
                  {data.analytics.usage.map((u, i) => (
                    <li key={i}><span>{u.car}</span> <span>{u.trips} trips</span></li>
                  ))}
                  {data.analytics.usage.length === 0 && <li>No usage data yet.</li>}
                </ul>
              </div>
              <div className="info-card">
                <h3> Maintenance Reminders</h3>
                <ul>
                  {data.analytics.maintenance.map((m, i) => (
                    <li key={i}>
                      <span>{m.car} - {m.issue}</span> 
                      <span className="badge warning">{m.date}</span>
                    </li>
                  ))}
                  {data.analytics.maintenance.length === 0 && <li>All cars are well maintained.</li>}
                </ul>
              </div>
            </div>
          </>
        )}

        {activeTab === "fleet" && (
          <div className="owner-table-container">
            <table className="owner-table">
              <thead><tr><th>Car Name</th><th>Brand</th><th>Rent Price</th><th>Status</th></tr></thead>
              <tbody>
                {data.cars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.name}</td><td>{car.brand}</td><td>₹{car.price}/day</td>
                    <td><span className={`badge ${car.status === 'Active' || car.status === 'Approved' ? 'success' : 'warning'}`}>{car.status}</span></td>
                  </tr>
                ))}
                {data.cars.length === 0 && <tr><td colSpan="4" style={{textAlign:'center'}}>You have no cars listed.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "add" && (
          <div className="add-car-form">
            <form onSubmit={handleAddCar}>
              <div className="form-group">
                <label>Car Name</label>
                <input type="text" value={newCar.name} onChange={(e) => setNewCar({...newCar, name: e.target.value})} required placeholder="e.g. Honda City" />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input type="text" value={newCar.brand} onChange={(e) => setNewCar({...newCar, brand: e.target.value})} required placeholder="e.g. Honda" />
              </div>
              <div className="form-group">
                <label>Daily Rent Price (₹)</label>
                <input type="number" value={newCar.price} onChange={(e) => setNewCar({...newCar, price: e.target.value})} required placeholder="e.g. 2500" />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="url" value={newCar.image} onChange={(e) => setNewCar({...newCar, image: e.target.value})} placeholder="https://example.com/car.jpg" />
              </div>
              <button type="submit" className="submit-btn">List Car</button>
            </form>
          </div>
        )}

        {activeTab === "requests" && (
          <div className="owner-table-container">
            <table className="owner-table">
              <thead><tr><th>Customer</th><th>Car</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {data.bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.userName}</td><td>{b.carName}</td>
                    <td>{b.startDate} to {b.endDate}</td>
                    <td><span className={`badge ${b.status === 'Confirmed' ? 'success' : b.status === 'Rejected' ? 'danger' : 'warning'}`}>{b.status}</span></td>
                    <td>
                      {b.status === 'Pending' && (
                        <>
                          <button className="action-btn accept" onClick={() => updateBookingStatus(b.id, "Confirmed")}>Accept</button>
                          <button className="action-btn reject" onClick={() => updateBookingStatus(b.id, "Rejected")}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {data.bookings.length === 0 && <tr><td colSpan="5" style={{textAlign:'center'}}>No booking requests found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="availability-container" style={{ animation: "fadeInUp 0.4s ease" }}>
            <h2 style={{ color: "var(--text)", marginBottom: "25px", paddingBottom: "15px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
               Fleet Availability Schedule
            </h2>
            
            {data.cars.length === 0 ? (
              <div style={{ background: "var(--bg-card)", padding: "30px", borderRadius: "12px", textAlign: "center", border: "1px solid var(--border)" }}>
                <p style={{ color: "var(--text)", opacity: 0.7 }}>You haven't listed any cars yet.</p>
              </div>
            ) : (
              data.cars.map(car => {
                const carBookings = data.bookings.filter(b => b.carName === car.name && b.status !== 'Rejected');
                
                return (
                  <div key={car.id} style={{ 
                    background: "var(--bg-card)", padding: "20px", borderRadius: "12px", 
                    marginBottom: "20px", border: "1px solid var(--border)",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                  }}>
                    <h3 style={{ color: "var(--text)", margin: "0 0 15px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>{car.name} <span style={{ fontSize: "0.9rem", opacity: 0.7, fontWeight: "normal", marginLeft: "10px" }}>({car.brand})</span></span>
                      <span className="badge success" style={{ fontSize: "0.8rem" }}>{car.status}</span>
                    </h3>
                    
                    {carBookings.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                        {carBookings.map(b => (
                          <div key={b.id} style={{ 
                            background: b.status === 'Confirmed' ? "rgba(59, 130, 246, 0.1)" : "rgba(245, 158, 11, 0.1)", 
                            border: b.status === 'Confirmed' ? "1px solid var(--accent)" : "1px solid #f59e0b", 
                            padding: "12px 18px", borderRadius: "8px" 
                          }}>
                            <div style={{ color: "var(--text)", fontSize: "0.85rem", opacity: 0.9, marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                              <span>Booked by <strong>{b.userName}</strong></span>
                              <span style={{ color: b.status === 'Confirmed' ? "var(--accent)" : "#f59e0b", marginLeft: "15px", fontWeight: "600" }}>{b.status}</span>
                            </div>
                            <div style={{ color: "var(--text)", fontWeight: "600", fontSize: "1.05rem" }}>
                              {b.startDate} <span style={{ opacity: 0.5, margin: "0 8px" }}>→</span> {b.endDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px dashed rgba(16, 185, 129, 0.3)", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ color: "var(--text)", margin: 0, fontWeight: "500" }}> Currently Fully Available</p>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default OwnerDashboard;