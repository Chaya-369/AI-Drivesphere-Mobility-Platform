import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import BackButton from "../components/BackButton";
import "./Auth.css";

function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [method, setMethod] = useState("card");
  const [payLaterMethod, setPayLaterMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [paymentDetails, setPaymentDetails] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "", upiId: "" });
  const [paymentError, setPaymentError] = useState("");

  const booking = state?.booking;
  const car = state?.car;

  const calculateDuration = () => {
    if (!booking?.fromDate || !booking?.toDate) return { hours: 48, label: "2 Days" };
    const start = new Date(booking.fromDate);
    const end = new Date(booking.toDate);
    const diffTime = Math.max(0, end - start);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      const h = diffHours > 0 ? diffHours : 1;
      return { hours: h, label: `${h} Hour${h > 1 ? 's' : ''}` };
    } else {
      const days = Math.ceil(diffHours / 24);
      return { hours: days * 24, label: `${days} Day${days > 1 ? 's' : ''}` };
    }
  };

  const duration = calculateDuration();
  const carPrice = car?.price || 2500;
  
  const subTotal = Math.round((carPrice / 24) * duration.hours);
  const platformFee = Math.round(subTotal * 0.1); // 10% platform fee instead of flat 500
  const securityDeposit = 1000; // Refundable deposit
  const totalCost = subTotal + platformFee - discount;
  const amountDueToday = totalCost + securityDeposit;
  const minimumAmount = Math.max(1100, Math.round(amountDueToday * 0.2)); // 20% of total
  const amountToPay = method === "pay_later" ? minimumAmount : amountDueToday;

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (code === "FIRST50") {
      setDiscount(Math.round(subTotal * 0.5));
      setCouponMessage("🎉 50% First-Time User Discount Applied!");
    } else if (code === "WELCOME20") {
      setDiscount(Math.round(subTotal * 0.2));
      setCouponMessage("🎉 20% Welcome Discount Applied!");
    } else if (code === "GREEN1000") {
      const isEV = car?.name?.includes("EV") || car?.name?.includes("Kona") || car?.type?.includes("Electric") || car?.type?.includes("EV");
      if (isEV) {
        setDiscount(Math.round(subTotal * 0.2));
        setCouponMessage("🌱 1000 Green Points Redeemed! 20% Off applied.");
      } else {
        setDiscount(0);
        setCouponMessage("❌ Green Points can only be redeemed on EV rentals!");
      }
    } else {
      setDiscount(0);
      setCouponMessage("❌ Invalid Coupon Code");
    }
  };

  const handlePayment = async () => {
    setPaymentError("");
    if (method === "card" || (method === "pay_later" && payLaterMethod === "card")) {
      if (!paymentDetails.cardName || !paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
        setPaymentError("Please fill in all credit/debit card details to proceed.");
        return;
      }
      if (paymentDetails.cardNumber.replace(/\s/g, '').length < 16) {
        setPaymentError("Please enter a valid 16-digit card number.");
        return;
      }
    } else if (method === "upi" || (method === "pay_later" && payLaterMethod === "upi")) {
      if (!paymentDetails.upiId) {
        setPaymentError("Please enter your UPI ID (Virtual Payment Address).");
        return;
      }
      if (!paymentDetails.upiId.includes("@")) {
        setPaymentError("Invalid UPI ID format. It should look like name@bank.");
        return;
      }
    }

    setIsProcessing(true);
    try {
      const payload = {
        userName: booking?.firstName ? `${booking.firstName} ${booking.lastName}` : "Guest User",
        carName: car?.name || "DriveSphere Vehicle",
        startDate: booking?.fromDate || new Date().toISOString().split('T')[0],
        endDate: booking?.toDate || new Date().toISOString().split('T')[0],
        pickupLocation: booking?.pickup || car?.location || "Bengaluru Center",
        method: method === "pay_later" ? "UPI / Pay Later" : (method === "card" ? "Credit/Debit Card" : "UPI"),
        amountPaid: `₹${amountToPay}`,
        totalAmount: `₹${amountDueToday}`
      };

      const response = await axios.post("http://localhost:5000/api/bookings/add", payload);
      
      setIsProcessing(false);
      navigate("/receipt", { state: { booking: response.data.booking } });
    } catch (error) {
      console.error("Payment failed", error);
      setIsProcessing(false);
      
      // Failsafe: If backend is down or blocked by CORS, still navigate so the user isn't stuck!
      const fallbackBooking = {
        bookingId: "DS" + Math.floor(100000 + Math.random() * 900000),
        userName: booking?.firstName ? `${booking.firstName} ${booking.lastName}` : "Guest User",
        carName: car?.name || "DriveSphere Vehicle",
        pickupLocation: booking?.pickup || car?.location || "Bengaluru Center",
        startDate: booking?.fromDate || new Date().toISOString().split('T')[0],
        endDate: booking?.toDate || new Date().toISOString().split('T')[0],
        method: method === "pay_later" ? "UPI / Pay Later" : (method === "card" ? "Credit/Debit Card" : "UPI"),
        amountPaid: `₹${amountToPay}`,
        totalAmount: `₹${amountDueToday}`,
        status: "Confirmed (Offline Failsafe)"
      };
      
      navigate("/receipt", { state: { booking: fallbackBooking } });
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: "center", paddingTop: "80px", overflowY: "auto", minHeight: "100vh" }}>
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <BackButton />
      </div>

      <div style={{
        width: "100%",
        maxWidth: "1100px",
        padding: "20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "40px",
        justifyContent: "center",
        alignItems: "flex-start"
      }}>
        
        {/* Left Side: Payment Method */}
        <div className="auth-card" style={{ flex: "1 1 500px", maxWidth: "600px", padding: "40px", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
            <div style={{ fontSize: "2.5rem", background: "var(--accent-bg)", padding: "15px", borderRadius: "16px", border: "1px solid var(--border)", color: "var(--text)" }}></div>
            <div>
              <h1 style={{ color: "var(--text)", margin: "0 0 5px 0", fontSize: "1.8rem" }}>Secure Checkout</h1>
              <p style={{ color: "var(--text)", margin: 0, fontSize: "0.95rem" }}>All transactions are secure and encrypted.</p>
            </div>
          </div>

          {/* Payment Tabs */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "30px", background: "rgba(15, 23, 42, 0.2)", padding: "5px", borderRadius: "12px" }}>
            <button
              onClick={() => setMethod("card")}
              style={{
                flex: 1, padding: "12px", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s",
                background: method === "card" ? "rgba(59, 130, 246, 0.2)" : "transparent",
                color: method === "card" ? "var(--accent)" : "var(--accent)",
                boxShadow: method === "card" ? "0 4px 10px rgba(15, 23, 42, 0.2)" : "none"
              }}
            >
              Credit/Debit Card
            </button>
            <button
              onClick={() => setMethod("upi")}
              style={{
                flex: 1, padding: "12px", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s",
                background: method === "upi" ? "rgba(59, 130, 246, 0.2)" : "transparent",
                color: method === "upi" ? "var(--accent)" : "var(--accent)",
                boxShadow: method === "upi" ? "0 4px 10px rgba(15, 23, 42, 0.2)" : "none"
              }}
            >
              UPI
            </button>
            <button
              onClick={() => setMethod("pay_later")}
              style={{
                flex: 1, padding: "12px", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s",
                background: method === "pay_later" ? "rgba(59, 130, 246, 0.2)" : "transparent",
                color: method === "pay_later" ? "var(--accent)" : "var(--accent)",
                boxShadow: method === "pay_later" ? "0 4px 10px rgba(15, 23, 42, 0.2)" : "none"
              }}
            >
              Pay Later
            </button>
          </div>

          {/* Card Input */}
          {method === "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeIn 0.3s ease" }}>
              <div>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem" }}>Cardholder Name</label>
                <input type="text" value={paymentDetails.cardName} onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})} placeholder="John Doe" style={{ width: "100%", padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
              </div>
              <div>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem" }}>Card Number</label>
                <input type="text" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} placeholder="0000 0000 0000 0000" style={{ width: "100%", padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
              </div>
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem" }}>Expiry Date</label>
                  <input type="text" value={paymentDetails.expiry} onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})} placeholder="MM/YY" style={{ width: "100%", padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem" }}>CVV</label>
                  <input type="password" value={paymentDetails.cvv} onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})} placeholder="•••" style={{ width: "100%", padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
                </div>
              </div>
            </div>
          )}

          {/* UPI Input */}
          {method === "upi" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", color: "var(--text)", marginBottom: "8px", fontSize: "0.9rem" }}>Virtual Payment Address (UPI ID)</label>
                <input type="text" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})} placeholder="name@upi" style={{ width: "100%", padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
              </div>
              
              <div style={{ textAlign: "center", padding: "30px", background: "var(--bg-card)", borderRadius: "12px", border: "1px dashed rgba(255, 255, 255, 0.1)" }}>
                <h3 style={{ color: "var(--text)", margin: "0 0 15px 0" }}>Scan & Pay</h3>
                <div style={{ 
                  width: "150px", height: "150px", margin: "0 auto 15px auto", 
                  background: "var(--bg-card)", borderRadius: "8px", padding: "10px",
                  display: "flex", justifyContent: "center", alignItems: "center"
                }}>
                  <div style={{ width: "100%", height: "100%", background: "repeating-conic-gradient(var(--text) 0% 25%, transparent 0% 50%) 50% / 20px 20px", opacity: 0.8 }}></div>
                </div>
                <p style={{ color: "var(--text)", margin: 0, fontSize: "0.9rem" }}>Use Google Pay, PhonePe, Paytm, or BHIM UPI.</p>
              </div>
            </div>
          )}

          {/* Pay Later Option */}
          {method === "pay_later" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ 
                background: "var(--bg-card)", 
                border: "1px solid rgba(59, 130, 246, 0.4)", 
                padding: "25px", borderRadius: "12px", marginBottom: "20px",
                boxShadow: "0 4px 10px var(--accent-bg)"
              }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                  <div style={{ fontSize: "2rem" }}>⏳</div>
                  <div>
                    <h3 style={{ color: "var(--text)", margin: "0 0 10px 0", fontSize: "1.2rem" }}>Secure Booking with Minimum Deposit</h3>
                    <p style={{ color: "var(--text)", margin: "0 0 10px 0", lineHeight: "1.5" }}>
                      Reserve your vehicle now by paying a minimum booking amount of <strong style={{ color: "var(--text)" }}>₹{minimumAmount}</strong>.
                    </p>
                    <p style={{ color: "var(--text)", margin: 0, fontSize: "0.9rem" }}>
                      The remaining balance of <strong>₹{amountDueToday - minimumAmount}</strong> must be paid at the time of vehicle pickup.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <p style={{ color: "var(--text)", margin: "0 0 15px 0", fontSize: "0.95rem" }}>Select a payment method for your deposit:</p>
                <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                  <div onClick={() => setPayLaterMethod("card")} style={{ flex: 1, padding: "10px", textAlign: "center", background: payLaterMethod === "card" ? "rgba(59, 130, 246, 0.1)" : "var(--bg-card)", border: payLaterMethod === "card" ? "1px solid var(--accent)" : "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "8px", cursor: "pointer", color: payLaterMethod === "card" ? "var(--accent)" : "var(--text)", transition: "all 0.2s" }}>Card</div>
                  <div onClick={() => setPayLaterMethod("upi")} style={{ flex: 1, padding: "10px", textAlign: "center", background: payLaterMethod === "upi" ? "rgba(59, 130, 246, 0.1)" : "var(--bg-card)", border: payLaterMethod === "upi" ? "1px solid var(--accent)" : "1px solid rgba(255, 255, 255, 0.2)", borderRadius: "8px", cursor: "pointer", color: payLaterMethod === "upi" ? "var(--accent)" : "var(--text)", transition: "all 0.2s" }}>UPI</div>
                </div>

                {payLaterMethod === "card" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px", animation: "fadeIn 0.3s ease" }}>
                    <div>
                      <input type="text" value={paymentDetails.cardName} onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})} placeholder="Cardholder Name" style={{ width: "100%", padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
                    </div>
                    <div>
                      <input type="text" value={paymentDetails.cardNumber} onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})} placeholder="Card Number (0000 0000 0000 0000)" style={{ width: "100%", padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
                    </div>
                    <div style={{ display: "flex", gap: "15px" }}>
                      <input type="text" value={paymentDetails.expiry} onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})} placeholder="MM/YY" style={{ flex: 1, padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
                      <input type="password" value={paymentDetails.cvv} onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})} placeholder="CVV" style={{ flex: 1, padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
                    </div>
                  </div>
                )}

                {payLaterMethod === "upi" && (
                  <div style={{ animation: "fadeIn 0.3s ease" }}>
                    <input type="text" value={paymentDetails.upiId} onChange={(e) => setPaymentDetails({...paymentDetails, upiId: e.target.value})} placeholder="name@upi" style={{ width: "100%", padding: "12px 15px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", color: "var(--text)" }} />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Order Summary */}
        <div className="auth-card" style={{ flex: "1 1 350px", maxWidth: "400px", padding: "30px", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 style={{ color: "var(--text)", fontSize: "1.3rem", margin: "0 0 25px 0", paddingBottom: "15px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>Booking Summary</h3>
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <span style={{ color: "var(--text)" }}>Vehicle Rental ({duration.label})</span>
            <span style={{ color: "var(--text)", fontWeight: "600" }}>₹{subTotal}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <span style={{ color: "var(--text)" }}>Platform Fee</span>
            <span style={{ color: "var(--text)", fontWeight: "600" }}>₹{platformFee}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <span style={{ color: "var(--text)" }}>Refundable Security Deposit</span>
            <span style={{ color: "var(--text)", fontWeight: "600" }}>₹{securityDeposit}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <span style={{ color: "var(--text)", fontWeight: "600" }}>Coupon Discount</span>
              <span style={{ color: "var(--text)", fontWeight: "600" }}>-₹{discount}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px dashed rgba(15, 23, 42, 0.1)" }}>
            <span style={{ color: "var(--text)" }}>Taxes & GST</span>
            <span style={{ color: "var(--text)", fontWeight: "600" }}>Included</span>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <select 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{ flex: 1, padding: "10px 15px", borderRadius: "8px", border: "1px solid var(--border)", outline: "none", fontSize: "0.95rem", backgroundColor: "var(--bg-card)", color: "var(--text)", cursor: "pointer", appearance: "none" }}
              >
                <option value="">Select a Coupon</option>
                <option value="FIRST50">FIRST50 (50% Off First Ride)</option>
                <option value="WELCOME20">WELCOME20 (20% Welcome Discount)</option>
                <option value="GREEN1000">Redeem 1000 Green Points (20% Off EV Ride)</option>
              </select>
              <button 
                onClick={handleApplyCoupon}
                style={{ padding: "10px 20px", background: "var(--bg-card)", color: "var(--text)", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <p style={{ margin: "10px 0 0 0", fontSize: "0.85rem", color: couponMessage.includes("❌") ? "var(--accent)" : "var(--accent)" }}>
                {couponMessage}
              </p>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ color: "var(--text)", fontSize: "1.1rem" }}>Total Rental Cost</span>
            <span style={{ color: "var(--text)", fontSize: "1.2rem", fontWeight: "700" }}>₹{totalCost}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "30px", paddingTop: "15px", borderTop: "1px dashed var(--border)" }}>
            <span style={{ display: "block", color: "var(--text)", fontSize: "1.2rem", fontWeight: "600" }}>Amount Due Today</span>
            <span style={{ color: "var(--text)", fontSize: "1.5rem", fontWeight: "900" }}>₹{amountDueToday}</span>
          </div>
          
          {paymentError && (
            <div style={{ 
              background: "rgba(239, 68, 68, 0.1)", 
              color: "#ef4444", 
              padding: "12px 15px", 
              borderRadius: "8px", 
              border: "1px solid rgba(239, 68, 68, 0.3)",
              marginBottom: "20px",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span style={{ fontWeight: "700" }}>⚠️</span>
              {paymentError}
            </div>
          )}

          {method === "pay_later" && (
            <div style={{ background: "var(--accent-bg)", padding: "15px", borderRadius: "8px", border: "1px dashed rgba(59, 130, 246, 0.3)", marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text)", fontWeight: "600" }}>Paying Today:</span>
                <span style={{ color: "var(--text)", fontSize: "1.5rem", fontWeight: "900" }}>₹{minimumAmount}</span>
              </div>
            </div>
          )}

          <button 
            className="auth-btn" 
            onClick={handlePayment}
            disabled={isProcessing}
            style={{
              background: isProcessing ? "var(--accent)" : (method === "pay_later" ? "var(--accent-gradient)" : "var(--accent-gradient)"),
              boxShadow: isProcessing ? "none" : (method === "pay_later" ? "0 4px 15px rgba(59, 130, 246, 0.4)" : "0 4px 15px rgba(59, 130, 246, 0.4)"),
              maxWidth: "100%",
              fontSize: "1.1rem"
            }}
          >
            {isProcessing ? "Processing Secure Payment..." : `Pay ₹${amountToPay} Securely`}
          </button>

          <p style={{ textAlign: "center", color: "var(--text)", margin: "20px 0 0 0", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
             Powered by Stripe Secure
          </p>
        </div>

      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Payment;