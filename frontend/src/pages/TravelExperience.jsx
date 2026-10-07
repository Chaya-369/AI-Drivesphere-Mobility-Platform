import { useState } from "react";
import "./Auth.css";

function TravelExperience() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState("");

  const showTravelInfo = () => {
    if (!city) {
      alert("Enter city name");
      return;
    }

    setResult(
      `Travel suggestions for ${city}: Nearby hotels, restaurants, tourist spots, parking areas, and EV charging stations will be recommended.`
    );
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Travel Experience</h2>
        <p>Get travel support with your car rental</p>

        <input
          placeholder="Enter destination city"
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={showTravelInfo}>Show Suggestions</button>

        <h3 style={{ marginTop: "20px" }}>{result}</h3>
      </div>
    </div>
  );
}

export default TravelExperience;