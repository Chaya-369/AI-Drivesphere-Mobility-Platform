import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Auth.css";

function Invoice() {
  const navigate = useNavigate();

  // In a real app, this would come from state/props/API
  const invoiceData = {
    invoiceNo: "DS2026-001",
    date: new Date().toLocaleDateString(),
    customer: "DriveSphere User",
    carName: "Hyundai Creta",
    brand: "Hyundai",
    rentalDays: 2,
    pricePerDay: 1499,
    serviceFee: 500,
  };

  const subTotal = invoiceData.rentalDays * invoiceData.pricePerDay;
  const totalAmount = subTotal + invoiceData.serviceFee;

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto", minHeight: "100vh" }}>
      <div className="no-print" style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div className="invoice-container" style={{
        width: "100%",
        maxWidth: "650px",
        padding: "20px",
      }}>
        
        {/* Main Invoice Card */}
        <div className="auth-card" style={{ 
          padding: "40px", 
          textAlign: "left",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 6px rgba(15, 23, 42, 0.05)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative Corner Glow */}
          <div className="no-print" style={{
            position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px",
            background: "var(--accent)", filter: "blur(80px)", opacity: 0.3, zIndex: 0
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "20px", marginBottom: "30px" }}>
              <div>
                <h1 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "2rem" }}>Invoice</h1>
                <p style={{ color: "var(--text)", margin: 0, fontWeight: "600", letterSpacing: "1px" }}>#{invoiceData.invoiceNo}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "1.5rem" }}>DriveSphere</h2>
                <p style={{ color: "var(--text)", margin: 0, fontSize: "0.9rem" }}>Date: {invoiceData.date}</p>
              </div>
            </div>

            {/* Customer & Car Info */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
              <div>
                <p style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "5px" }}>Billed To</p>
                <p style={{ color: "var(--text)", fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>{invoiceData.customer}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "var(--text)", fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "5px" }}>Vehicle</p>
                <p style={{ color: "var(--text)", fontSize: "1.1rem", fontWeight: "600", margin: 0 }}>{invoiceData.brand} {invoiceData.carName}</p>
              </div>
            </div>

            {/* Invoice Table */}
            <div style={{ background: "var(--bg-card)", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)", overflow: "hidden", marginBottom: "30px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--text)" }}>
                <thead>
                  <tr style={{ background: "var(--accent-bg)", textAlign: "left" }}>
                    <th style={{ padding: "15px", fontWeight: "600", fontSize: "0.9rem", color: "var(--text)", background: "transparent" }}>Description</th>
                    <th style={{ padding: "15px", fontWeight: "600", fontSize: "0.9rem", color: "var(--text)", textAlign: "right", background: "transparent" }}>Rate</th>
                    <th style={{ padding: "15px", fontWeight: "600", fontSize: "0.9rem", color: "var(--text)", textAlign: "right", background: "transparent" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "15px" }}>Rental ({invoiceData.rentalDays} Days)</td>
                    <td style={{ padding: "15px", textAlign: "right" }}>₹{invoiceData.pricePerDay}</td>
                    <td style={{ padding: "15px", textAlign: "right" }}>₹{subTotal}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "15px" }}>Platform Service Fee</td>
                    <td style={{ padding: "15px", textAlign: "right" }}>-</td>
                    <td style={{ padding: "15px", textAlign: "right" }}>₹{invoiceData.serviceFee}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Section */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", background: "var(--accent-bg)", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text)", fontSize: "1.2rem", fontWeight: "600" }}>Total Amount</span>
              <span style={{ color: "var(--text)", fontSize: "2rem", fontWeight: "900" }}>₹{totalAmount}</span>
            </div>

            {/* Print Button */}
            <div className="no-print" style={{ marginTop: "40px", textAlign: "center" }}>
              <button 
                className="auth-btn" 
                onClick={() => window.print()}
                style={{ maxWidth: "300px", background: "var(--accent)", color: "var(--bg-card)", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" }}
              >
                ️ Print Invoice
              </button>
            </div>
            
            <p className="no-print" style={{ textAlign: "center", color: "var(--text)", marginTop: "20px", fontSize: "0.9rem" }}>
              Thank you for choosing DriveSphere!
            </p>

          </div>
        </div>
      </div>

      {/* Print CSS Rules */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .auth-page {
            background: white !important;
            padding: 0 !important;
          }
          .auth-card {
            background: white !important;
            border: 1px solid var(--accent) !important;
            box-shadow: none !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          h1, h2, h3, p, span, td, th {
            color: black !important;
            text-shadow: none !important;
          }
          table {
            border: 1px solid var(--bg-card) !important;
          }
          th, td, tr {
            border-bottom: 1px solid var(--bg-card) !important;
          }
        }
      `}</style>
    </div>
  );
}

export default Invoice;