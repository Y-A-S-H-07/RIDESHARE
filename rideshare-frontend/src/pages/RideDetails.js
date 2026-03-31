import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function RideDetails() {
  const location = useLocation();
  const initialRide = location.state;

  const user = JSON.parse(localStorage.getItem("user"));

  const [ride, setRide] = useState(initialRide);
  const [driverId, setDriverId] = useState(null);

  // 🔥 fetch driverId
  useEffect(() => {
    fetchDriver();
  }, []);

  const fetchDriver = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/drivers/by-user?userId=${user.id}`
      );
      const data = await res.json();
      setDriverId(data.id);
    } catch (err) {
      console.error("Error fetching driver:", err);
    }
  };

  // 🔥 reload ride after action (no full reload)
  const refreshRide = async () => {
    const res = await fetch("http://localhost:8080/rides/all");
    const data = await res.json();

    const updated = data.find((r) => r.id === ride.id);
    setRide(updated);
  };

  const acceptRide = async () => {
    try {
      await fetch(
        `http://localhost:8080/rides/accept?rideId=${ride.id}&driverId=${driverId}`,
        { method: "POST" }
      );

      alert("Ride accepted");
      refreshRide(); // ✅ update UI
    } catch (err) {
      alert("Error accepting ride");
    }
  };

  const startRide = async () => {
    await fetch(
      `http://localhost:8080/rides/start?rideId=${ride.id}`,
      { method: "POST" }
    );

    alert("Ride started");
    refreshRide();
  };

  const completeRide = async () => {
    await fetch(
      `http://localhost:8080/rides/complete?rideId=${ride.id}`,
      { method: "POST" }
    );

    alert("Ride completed");
    refreshRide();
  };

  if (!ride) return <p>No ride data</p>;

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Ride Details</h2>

        <div className="card">
          <p><b>From:</b> {ride.source}</p>
          <p><b>To:</b> {ride.destination}</p>
          <p><b>Status:</b> {ride.status}</p>
          <p><b>Seats:</b> {ride.availableSeats}</p>
          <p><b>Fare:</b> {ride.totalFare}</p>

          {/* ACCEPT */}
          {ride.status === "CREATED" && (
            <button
              className="button"
              onClick={acceptRide}
              disabled={!driverId}
            >
              Accept Ride
            </button>
          )}

          {/* START */}
          {ride.status === "ACCEPTED" &&
            ride.driver &&
            ride.driver.id === driverId && (
              <button className="button" onClick={startRide}>
                Start Ride
              </button>
            )}

          {/* COMPLETE */}
          {ride.status === "STARTED" &&
            ride.driver &&
            ride.driver.id === driverId && (
              <button className="button" onClick={completeRide}>
                Complete Ride
              </button>
            )}
        </div>
      </div>
    </>
  );
}

export default RideDetails;