import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import BackButton from "../components/BackButton";

function Review() {
  const [review, setReview] = useState({
    carName: "",
    userName: "",
    rating: 0,
    comment: ""
  });
  
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setReview({
      ...review,
      [e.target.name]: e.target.value
    });
    setStatus({ type: "", text: "" });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!review.carName || !review.userName || !review.rating || !review.comment) {
      setStatus({ type: "error", text: "Please fill in all fields and provide a rating." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/reviews/add", review);
      setStatus({ type: "success", text: response.data.message || "Review submitted successfully!" });
      setReview({ carName: "", userName: "", rating: 0, comment: "" }); // reset
    } catch (error) {
      setStatus({ type: "error", text: "Failed to submit review. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <BackButton />
      </div>
      
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <h2>Review & Rating</h2>
        <p>Share your car rental experience</p>

        {status.text && (
          <div className={`error-message`} style={{
            background: status.type === 'success' ? 'var(--accent-bg)' : 'var(--accent-bg)',
            borderColor: status.type === 'success' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.3)',
            color: status.type === 'success' ? 'var(--accent)' : 'var(--accent)'
          }}>
            {status.text}
          </div>
        )}

        <form onSubmit={submitReview}>
          <div className="input-group">
            <span className="input-icon"></span>
            <input 
              name="carName" 
              placeholder="Which car did you rent?" 
              value={review.carName}
              onChange={handleChange} 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <span className="input-icon"></span>
            <input 
              name="userName" 
              placeholder="Your full name" 
              value={review.userName}
              onChange={handleChange} 
              disabled={loading}
            />
          </div>

          <div style={{ margin: "20px 0", textAlign: "center" }}>
            <p style={{ margin: "0 0 10px 0", color: "var(--text)", fontWeight: "500" }}>Rate your experience</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  style={{
                    fontSize: "2rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    color: (hoverRating || review.rating) >= star ? "var(--accent)" : "rgba(255, 255, 255, 0.2)",
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={() => !loading && setHoverRating(star)}
                  onMouseLeave={() => !loading && setHoverRating(0)}
                  onClick={() => !loading && setReview({...review, rating: star})}
                >
                  
                </span>
              ))}
            </div>
          </div>

          <div className="input-group">
            <span className="input-icon" style={{ top: "25px" }}></span>
            <textarea 
              name="comment" 
              placeholder="Tell us what you loved or what we can improve..." 
              value={review.comment}
              onChange={handleChange}
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 14px 14px 45px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--text)",
                fontSize: "1rem",
                minHeight: "120px",
                resize: "vertical",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
            style={{ marginTop: "10px" }}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Review;