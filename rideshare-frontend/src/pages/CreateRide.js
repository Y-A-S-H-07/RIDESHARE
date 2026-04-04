import React, { useState } from "react";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";

function CreateRide() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [hostSeats, setHostSeats] = useState(1);
  const [hasActiveRide, setHasActiveRide] = useState(false);

  const [fares, setFares] = useState({});
  const [loadingFare, setLoadingFare] = useState(false);

  // ✅ Get fare for all vehicle types
  const getFare = async () => {
    if (!source || !destination) {
      alert("Enter source and destination first");
      return;
    }

    setLoadingFare(true);

    const types = ["3_SEATER", "4_SEATER", "5_SEATER", "7_SEATER"];
    const result = {};

    try {
      for (let type of types) {
        const res = await fetch(
          `http://localhost:8080/rides/estimate?source=${source}&destination=${destination}&vehicleType=${type}`
        );

        const data = await res.json();
        result[type] = data.toFixed(2);
      }

      setFares(result);
    } catch (err) {
      alert("Error fetching fare");
    }

    setLoadingFare(false);
  };

  // ✅ check active ride
  const checkActiveRide = async () => {
    const res = await fetch("http://localhost:8080/rides/all");
    const data = await res.json();

    const active = data.find(
      (r) =>
        r.host?.id === user.id &&
        (r.status === "CREATED" ||
          r.status === "ACCEPTED" ||
          r.status === "STARTED")
    );

    setHasActiveRide(!!active);
  };

  const createRide = async () => {
    if (hasActiveRide) {
      alert("You already have an active ride");
      return;
    }

    if (!vehicleType) {
      alert("Please select vehicle type");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/rides/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          destination,
          vehicleType,
          hostSeats,
          totalFare: Number(fares[vehicleType] || 0),
          host: { id: user.id }
        })
      });

      const data = await res.json();

      alert(`Ride Created Successfully!
      Fare: ₹${data.totalFare.toFixed(2)}
      Distance: ${data.distance.toFixed(1)} km`);
    } catch (err) {
      alert("Error creating ride");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Create Ride</h2>

        <div className="card">
          <input
            className="input"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />

          <input
            className="input"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <input
            className="input"
            type="number"
            placeholder="Host Seats"
            value={hostSeats}
            onChange={(e) => setHostSeats(e.target.value)}
          />

          {/* ✅ GET FARE BUTTON */}
          <button className="button" onClick={getFare}>
            Get Fare
          </button>

          {/* ✅ LOADING */}
          {loadingFare && <p>Calculating fares...</p>}

          {/* ✅ SHOW ALL FARES */}
          {Object.keys(fares).length > 0 && (
            <div style={{ marginTop: 15 }}>
              <h4>Select Vehicle</h4>

              {Object.entries(fares).map(([type, price]) => (
                <div
                  key={type}
                  onClick={() => setVehicleType(type)}
                  style={{
                    padding: "10px",
                    marginTop: "8px",
                    border: vehicleType === type ? "2px solid black" : "1px solid #ccc",
                    cursor: "pointer",
                    borderRadius: "6px"
                  }}
                >
                  {type.replace("_", " ")} — ₹{price}
                </div>
              ))}
            </div>
          )}

          <button className="button" onClick={createRide}>
            Create Ride
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateRide;