import { useState } from "react";
import BackButton from "../components/BackButton";
import "./Auth.css";

function Sustainability() {
  const [km, setKm] = useState("");
  const [result, setResult] = useState(null);

  const calculateEV = () => {
    if (!km) {
      alert("Please enter trip distance");
      return;
    }

    const distance = Number(km);
    const fuelEmission = distance * 0.12;
    const evEmission = distance * 0.03;
    const saved = fuelEmission - evEmission;
    const rewardPoints = Math.round(saved * 10);

    let car = "Tata Nexon EV";
    let charging = "1 charging stop recommended";
    let range = "312 km range";

    if (distance <= 120) {
      car = "Tata Nexon EV";
      charging = "No charging stop required";
      range = "312 km range";
    } else if (distance <= 250) {
      car = "MG ZS EV";
      charging = "1 fast charging stop recommended";
      range = "461 km range";
    } else if (distance <= 400) {
      car = "Hyundai Kona EV";
      charging = "1–2 charging stops recommended";
      range = "452 km range";
    } else {
      car = "BYD Atto 3";
      charging = "2+ charging stops recommended";
      range = "521 km range";
    }

    setResult({
      saved: saved.toFixed(2),
      rewardPoints,
      car,
      charging,
      range,
      stations: ["Tata Power EV Station", "Ather Grid", "Zeon Charging"]
    });
  };

  return (
    <div className="ev-page">
      <BackButton />

      <div className="ev-container">
        <div className="ev-left">
          <h1>EV Rentals & Sustainability</h1>
          <p>
            Choose electric vehicles, reduce carbon emissions, earn green rewards,
            and get smart charging suggestions for your trip.
          </p>

          <div className="ev-points">
            <div> CO₂ Saving Calculator</div>
            <div> Charging Stop Suggestions</div>
            <div> Green Reward Points</div>
            <div> EV Car Recommendation</div>
          </div>
        </div>

        <div className="ev-card">
          <h2>Plan Your EV Trip</h2>

          <input
            type="number"
            placeholder="Enter trip distance in KM"
            onChange={(e) => setKm(e.target.value)}
          />

          <button onClick={calculateEV}>
            Generate EV Plan
          </button>

          {result && (
            <div className="ev-result-box">
              <div className="ev-result-card">
                <h3> CO₂ Saved</h3>
                <p>{result.saved} kg</p>
              </div>

              <div className="ev-result-card">
                <h3> Rewards Earned</h3>
                <p>{result.rewardPoints} Green Points</p>
              </div>

              <div className="ev-result-card">
                <h3> Suggested EV</h3>
                <p>{result.car}</p>
                <small>{result.range}</small>
              </div>

              <div className="ev-result-card">
                <h3> Charging Plan</h3>
                <p>{result.charging}</p>
              </div>

              <div className="charging-list">
                <h3>Nearby Charging Networks</h3>
                {result.stations.map((station, index) => (
                  <p key={index}> {station}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sustainability;