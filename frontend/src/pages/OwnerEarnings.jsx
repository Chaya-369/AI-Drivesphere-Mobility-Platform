import BackButton from "../components/BackButton";

function OwnerEarnings() {
  return (
    <div className="earnings-page">
      <BackButton />

      <h1>Earnings Dashboard</h1>

      <div className="earnings-stats">
        <div>
          <h2>₹12,500</h2>
          <p>Total Earnings</p>
        </div>

        <div>
          <h2>5</h2>
          <p>Completed Bookings</p>
        </div>

        <div>
          <h2>₹2,500</h2>
          <p>Pending Amount</p>
        </div>
      </div>

      <div className="earnings-table">
        <h2>Recent Payments</h2>

        <table>
          <thead>
            <tr>
              <th>Car</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>BMW X5</td>
              <td>Chaya</td>
              <td>₹9000</td>
              <td>Paid</td>
            </tr>

            <tr>
              <td>Hyundai Creta</td>
              <td>Rahul</td>
              <td>₹3500</td>
              <td>Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OwnerEarnings;