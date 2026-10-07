import BackButton from "../components/BackButton";

function OwnerBookings() {
  const requests = [
    { user: "Chaya", car: "BMW X5", date: "12 Jan 2026", status: "Pending" },
    { user: "Rahul", car: "Audi A4", date: "15 Jan 2026", status: "Approved" },
    { user: "Priya", car: "Hyundai Creta", date: "18 Jan 2026", status: "Pending" },
  ];

  return (
    <div className="ownerbookings-page">
      <BackButton />

      <h1>Booking Requests</h1>

      <div className="booking-request-grid">
        {requests.map((req, index) => (
          <div className="booking-request-card" key={index}>
            <h2>{req.car}</h2>
            <p><b>User:</b> {req.user}</p>
            <p><b>Date:</b> {req.date}</p>
            <p><b>Status:</b> {req.status}</p>

            <div className="request-actions">
              <button onClick={() => alert("Booking Approved")}>Approve</button>
              <button className="reject-btn" onClick={() => alert("Booking Rejected")}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OwnerBookings;