import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "User"
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    if (status.text) setStatus({ type: "", text: "" });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setStatus({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/signup", form);
      
      // Save user to local storage if API returns it, or just a mock
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        localStorage.setItem("user", JSON.stringify({ name: form.name, role: form.role }));
      }

      setStatus({ type: "success", text: "Account created successfully! Redirecting..." });
      
      // Redirect to home page as requested
      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (error) {
      setStatus({ 
        type: "error", 
        text: error.response?.data?.message || "Signup failed. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join DriveSphere today</p>

        {status.text && (
          <div className="error-message" style={{
            background: status.type === 'success' ? 'var(--accent-bg)' : 'var(--accent-bg)',
            borderColor: status.type === 'success' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.3)',
            color: status.type === 'success' ? 'var(--accent)' : 'var(--accent)'
          }}>
            {status.text}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <span className="input-icon"></span>
            <input 
              name="name" 
              type="text" 
              placeholder="Full name" 
              value={form.name}
              onChange={handleChange} 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">️</span>
            <input 
              name="email" 
              type="email" 
              placeholder="Email address" 
              value={form.email}
              onChange={handleChange} 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <span className="input-icon"></span>
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              value={form.password}
              onChange={handleChange} 
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <span className="input-icon"></span>
            <select 
              name="role" 
              value={form.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="User">User</option>
              <option value="Car Owner">Car Owner</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Signup"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;