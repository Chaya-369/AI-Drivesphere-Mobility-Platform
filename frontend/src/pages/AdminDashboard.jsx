import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    users: [],
    cars: [],
    bookings: [],
    tickets: [],
    analytics: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, carsRes, bookingsRes, ticketsRes, analyticsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users"),
        axios.get("http://localhost:5000/api/admin/cars"),
        axios.get("http://localhost:5000/api/admin/bookings"),
        axios.get("http://localhost:5000/api/admin/tickets"),
        axios.get("http://localhost:5000/api/admin/analytics"),
      ]);
      setData({
        users: usersRes.data,
        cars: carsRes.data,
        bookings: bookingsRes.data,
        tickets: ticketsRes.data,
        analytics: analyticsRes.data,
      });
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Security check: Only allow 'Admin' role
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "Admin") {
      navigate("/home");
      return;
    }

    fetchAllData();
  }, [navigate]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setData((prev) => ({ ...prev, users: prev.users.filter((u) => u.id !== id) }));
    } catch (e) { console.error(e); }
  };

  const updateCarStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/cars/${id}/status`, { status });
      fetchAllData();
    } catch (e) { console.error(e); }
  };

  const deleteCar = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/cars/${id}`);
      setData((prev) => ({ ...prev, cars: prev.cars.filter((c) => c.id !== id) }));
    } catch (e) { console.error(e); }
  };

  const resolveTicket = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/tickets/${id}/status`, { status: "Resolved" });
      fetchAllData();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="admin-dashboard loading">Loading Dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">️ DriveSphere Admin</div>
        <button className="sidebar-btn" onClick={() => navigate(-1)} style={{ marginBottom: '1rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>⬅️ Back</button>
        <button className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}> Overview & AI</button>
        <button className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}> Users</button>
        <button className={`sidebar-btn ${activeTab === 'cars' ? 'active' : ''}`} onClick={() => setActiveTab('cars')}> Cars</button>
        <button className={`sidebar-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}> Bookings & Payments</button>
        <button className={`sidebar-btn ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}> Support Tickets</button>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
        </div>

        {activeTab === "overview" && data.analytics && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <p>Total Users</p>
                <h2>{data.analytics.totalUsers}</h2>
              </div>
              <div className="stat-card">
                <p>Total Cars</p>
                <h2>{data.analytics.totalCars}</h2>
              </div>
              <div className="stat-card">
                <p>Total Bookings</p>
                <h2>{data.analytics.totalBookings}</h2>
              </div>
              <div className="stat-card">
                <p>Total Revenue</p>
                <h2>
                  {data.analytics.totalRevenue >= 100000 
                    ? `₹${(data.analytics.totalRevenue / 100000).toFixed(2)}L` 
                    : `₹${data.analytics.totalRevenue.toLocaleString('en-IN')}`}
                </h2>
              </div>
            </div>
            
            <div className="ai-insights">
              <h3> AI Analytics & Insights</h3>
              <ul>
                {data.analytics.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td><td>{user.email}</td>
                    <td><span className={`badge ${user.role === 'admin' ? 'warning' : 'success'}`}>{user.role}</span></td>
                    <td>
                      {user.role !== 'admin' && (
                        <button className="action-btn delete" onClick={() => deleteUser(user.id)}>Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "cars" && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>Car Name</th><th>Brand</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {data.cars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.name}</td><td>{car.brand}</td><td>₹{car.price}/day</td>
                    <td><span className={`badge ${car.status === 'Approved' ? 'success' : car.status === 'Rejected' ? 'danger' : 'warning'}`}>{car.status}</span></td>
                    <td>
                      {car.status !== 'Approved' && <button className="action-btn approve" onClick={() => updateCarStatus(car.id, "Approved")}>Approve</button>}
                      {car.status !== 'Rejected' && <button className="action-btn delete" onClick={() => updateCarStatus(car.id, "Rejected")}>Reject</button>}
                      <button className="action-btn delete" onClick={() => deleteCar(car.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>User</th><th>Car</th><th>Dates</th><th>Status</th><th>Payment</th></tr></thead>
              <tbody>
                {data.bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.userName}</td><td>{b.carName}</td>
                    <td>{b.startDate} to {b.endDate}</td>
                    <td><span className={`badge ${b.status === 'Confirmed' ? 'success' : 'warning'}`}>{b.status}</span></td>
                    <td><span className="badge success">Paid</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>User</th><th>Issue</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {data.tickets.map((t) => (
                  <tr key={t.id}>
                    <td>{t.user}</td><td>{t.issue}</td>
                    <td><span className={`badge ${t.status === 'Resolved' ? 'success' : 'danger'}`}>{t.status}</span></td>
                    <td>
                      {t.status !== 'Resolved' && (
                        <button className="action-btn resolve" onClick={() => resolveTicket(t.id)}>Mark Resolved</button>
                      )}
                    </td>
                  </tr>
                ))}
                {data.tickets.length === 0 && <tr><td colSpan="4" style={{textAlign:'center'}}>No support tickets found.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;