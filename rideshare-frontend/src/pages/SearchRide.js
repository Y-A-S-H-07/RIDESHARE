import React, { useState } from "react";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function SearchRide() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [rides, setRides] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchRides = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/rides/search?source=${source}&destination=${destination}`
      );

      const data = await res.json();
      setRides(data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const joinRide = async (rideId) => {
    const res = await fetch(
      `http://localhost:8080/rides/join?rideId=${rideId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id })
      }
    );

    alert(await res.text());
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Search Ride</h2>

        {/* 🔍 Search Box */}
        <div className="card">
          <input
            className="input"
            placeholder="Source"
            onChange={(e) => setSource(e.target.value)}
          />

          <input
            className="input"
            placeholder="Destination"
            onChange={(e) => setDestination(e.target.value)}
          />

          <button className="button" onClick={searchRides}>
            Search
          </button>
        </div>

        <div style={{ marginTop: 20 }}>
          {/* ⏳ Loading */}
          {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

          {/* ❌ Empty */}
          {searched && !loading && rides.length === 0 && (
            <p style={{ textAlign: "center" }}>No rides found</p>
          )}

          {/* ✅ Ride List */}
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="card"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/ride-details", { state: ride })
              }
            >
              
              <p>
                <b>{ride.source}</b> → {ride.destination}
              </p>

              {/* 💰 Fare */}
              <p>
                Fare: <b>₹{ride.totalFare?.toFixed(2)}</b>
              </p>

              {/* 📍 Distance */}
              <p>
                Distance: {ride.distance?.toFixed(1)} km
              </p>

              {/* 🪑 Seats */}
              <p>Seats Available: {ride.availableSeats}</p>

              {/* 📊 Status */}
              <p>Status: {ride.status}</p>

              <button
                className="button"
                onClick={() => joinRide(ride.id)}
              >
                Join Ride
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SearchRide;