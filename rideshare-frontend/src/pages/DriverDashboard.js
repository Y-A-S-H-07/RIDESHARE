import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function DriverDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [rides, setRides] = useState([]);
  const [driverId, setDriverId] = useState(null);
  const [hasActiveRide, setHasActiveRide] = useState(false);

  const navigate = useNavigate();

  // Load driver on start
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

      // check active ride after driver loaded
      checkActiveRide(data.id);
    } catch (err) {
      console.error("Error fetching driver:", err);
    }
  };

  const checkActiveRide = async (driverId) => {
    if (!driverId) return;

    const res = await fetch("http://localhost:8080/rides/all");
    const data = await res.json();

    const active = data.find(
      (r) =>
        r.driver &&
        r.driver.id === driverId &&
        (r.status === "ACCEPTED" || r.status === "STARTED")
    );

    setHasActiveRide(!!active);
  };

  const fetchRides = async () => {
    const res = await fetch("http://localhost:8080/rides/available");
    const data = await res.json();
    setRides(data);
  };

  const acceptRide = async (rideId) => {
    if (!driverId) {
      alert("Driver not loaded yet!");
      return;
    }

    try {
      await fetch(
        `http://localhost:8080/rides/accept?rideId=${rideId}&driverId=${driverId}`,
        { method: "POST" }
      );

      alert("Ride accepted");

      fetchRides();
      checkActiveRide(driverId);
    } catch (err) {
      alert("Error accepting ride");
    }
  };

  const startRide = async (rideId) => {
    await fetch(`http://localhost:8080/rides/start?rideId=${rideId}`, {
      method: "POST",
    });

    fetchRides();
    checkActiveRide(driverId);
  };

  const completeRide = async (rideId) => {
    await fetch(`http://localhost:8080/rides/complete?rideId=${rideId}`, {
      method: "POST",
    });

    fetchRides();
    checkActiveRide(driverId);
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Driver Dashboard</h2>

        <button className="button" onClick={fetchRides}>
          Load Rides
        </button>

        {rides.map((ride) => (
          <div
            key={ride.id}
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/ride-details", { state: ride })}
          >
            <p>
              {ride.source} → {ride.destination}
            </p>
            <p>Status: {ride.status}</p>

            <div style={{ marginTop: 10 }}>
              {/* ACCEPT */}
              <button
                className="button"
                disabled={
                  hasActiveRide || ride.status !== "CREATED"
                }
                onClick={(e) => {
                  e.stopPropagation();
                  acceptRide(ride.id);
                }}
              >
                {ride.status !== "CREATED"
                  ? "Not Available"
                  : hasActiveRide
                  ? "Already Assigned"
                  : "Accept Ride"}
              </button>

              {/* START */}
              {ride.status === "ACCEPTED" &&
                ride.driver &&
                ride.driver.id === driverId && (
                  <button
                    className="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startRide(ride.id);
                    }}
                  >
                    Start
                  </button>
                )}

              {/* COMPLETE */}
              {ride.status === "STARTED" &&
                ride.driver &&
                ride.driver.id === driverId && (
                  <button
                    className="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      completeRide(ride.id);
                    }}
                  >
                    Complete
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DriverDashboard;