import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DriverRideDetails() {
  const { rideId } = useParams();
  const navigate = useNavigate();

  const [ride, setRide] = useState(null);

  const fetchRide = async () => {
    const res = await fetch("http://localhost:8080/rides/all");
    const data = await res.json();

    const currentRide = data.find((r) => r.id === parseInt(rideId));
    setRide(currentRide);
  };

  useEffect(() => {
    fetchRide();
  }, []);

  const arrived = async () => {
    await fetch(`http://localhost:8080/rides/arrived?rideId=${rideId}`, {
      method: "POST",
    });
    fetchRide();
  };

  const startRide = async () => {
    await fetch(`http://localhost:8080/rides/start?rideId=${rideId}`, {
      method: "POST",
    });
    fetchRide();
  };

  const completeRide = async () => {
    await fetch(`http://localhost:8080/rides/complete?rideId=${rideId}`, {
      method: "POST",
    });
    fetchRide();
  };

  if (!ride) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div style={{ padding: "30px", background: "#f5f6fa", minHeight: "100vh" }}>
      
      {/* Top Bar */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 16px",
            border: "none",
            backgroundColor: "#2f80ed",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          ← Back
        </button>
      </div>

      {/* Card */}
      <div
        style={{
          maxWidth: "500px",
          margin: "auto",
          background: "white",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Ride Details</h2>

        <p><b>Source:</b> {ride.source}</p>
        <p><b>Destination:</b> {ride.destination}</p>
        <p><b>Status:</b> {ride.status}</p>
        <p><b>Fare:</b> ₹{ride.totalFare}</p>

        <div style={{ marginTop: "25px" }}>
          {ride.status === "ACCEPTED" && (
            <button
              onClick={arrived}
              style={btnStyle}
            >
              Arrived
            </button>
          )}

          {ride.status === "ARRIVED" && (
            <button
              onClick={startRide}
              style={btnStyle}
            >
              Start Ride
            </button>
          )}

          {ride.status === "STARTED" && (
            <button
              onClick={completeRide}
              style={{ ...btnStyle, backgroundColor: "#27ae60" }}
            >
              End Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "10px 18px",
  border: "none",
  backgroundColor: "#f2994a",
  color: "white",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500"
};

export default DriverRideDetails;