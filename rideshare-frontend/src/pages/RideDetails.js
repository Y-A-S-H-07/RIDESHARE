import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function RideDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const ride = location.state;

  if (!ride) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>No ride data found</p>

          {/* fallback navigation */}
          <button
            className="button"
            onClick={() => navigate("/search-ride")}
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <button className="button" onClick={() => navigate(-1)}>
          Back
        </button>

        <h2>Ride Details</h2>

        <div className="card">
          <p><b>Source:</b> {ride.source}</p>
          <p><b>Destination:</b> {ride.destination}</p>
          <p><b>Status:</b> {ride.status}</p>
          <p><b>Fare:</b> ₹{ride.totalFare?.toFixed(2)}</p>
          <p><b>Distance:</b> {ride.distance?.toFixed(2)} km</p>
        </div>
      </div>
    </>
  );
}

export default RideDetails;