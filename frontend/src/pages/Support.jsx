import React, { useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";
import "./Auth.css";

function Support() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Booking Issue");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !description) {
      alert("Please enter your name and describe the issue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user: name,
        issue: `[${type}] ${description}`
      };
      
      await axios.post("http://localhost:5000/api/tickets/add", payload);
      alert("Support request submitted successfully! An admin will review it shortly.");
      setName("");
      setEmail("");
      setType("Booking Issue");
      setDescription("");
    } catch (error) {
      console.error("Failed to submit ticket:", error);
      alert("Failed to submit support request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="info-page">
      <BackButton />

      <div className="info-container">
        <h1 className="info-title">Customer Support</h1>
        <p className="info-subtitle">
          We are here to help with bookings, payments, safety, and account issues.
        </p>

        <div className="support-layout">
          <div className="support-info">
            <h3>Need Quick Help?</h3>
            <p> +91 9876543210</p>
            <p> support@drivesphere.com</p>
            <p> Bangalore, India</p>

            <h3>Available Support</h3>
            <p> Booking Issues</p>
            <p> Payment Help</p>
            <p> Safety Assistance</p>
            <p> Owner Support</p>
          </div>

          <div className="support-form">
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Your name" 
            />
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email address" 
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Booking Issue">Booking Issue</option>
              <option value="Payment Issue">Payment Issue</option>
              <option value="Safety Help">Safety Help</option>
              <option value="Owner Support">Owner Support</option>
            </select>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe your issue"
            ></textarea>

            <button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support;