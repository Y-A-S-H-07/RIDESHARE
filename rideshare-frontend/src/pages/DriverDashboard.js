import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function DriverDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [rides, setRides] = useState([]);
  const [driverId, setDriverId] = useState(null);
  const [hasActiveRide, setHasActiveRide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [driverLoading, setDriverLoading] = useState(true);
  const [activeRide, setActiveRide] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "DRIVER") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    fetchDriver();
  }, []);

  useEffect(() => {
    if (driverId) {
      fetchActiveRide();
    }
  }, [driverId]);

  const fetchActiveRide = async () => {
    const res = await fetch("http://localhost:8080/rides/all");
    const data = await res.json();

    const current = data.find(
      (r) =>
        r.driver?.id === driverId &&
        (r.status === "ACCEPTED" ||
          r.status === "ARRIVED" ||
          r.status === "STARTED")
    );

    setActiveRide(current);
  };

  const fetchDriver = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/drivers/by-user?userId=${user.id}`
      );

      const data = await res.json();

      console.log("Driver Data:", data);

      setDriverId(data.id);
      setDriverLoading(false);

      checkActiveRide(data.id);
    } catch (err) {
      console.error(err);
      setDriverLoading(false);
    }
  };

  const checkActiveRide = async (driverId) => {
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
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/rides/available");
      const data = await res.json();
      setRides(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const acceptRide = async (rideId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/rides/accept?rideId=${rideId}&driverId=${driverId}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
      } else {
        navigate(`/driver/ride/${rideId}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
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

        {driverLoading ? (
          <p>Loading driver...</p>
        ) : (
          <>
            {/* ✅ ADDED BUTTON BLOCK */}
            {activeRide && (
              <div className="card">
                <h3>My Active Ride</h3>
                <p>
                  {activeRide.source} → {activeRide.destination}
                </p>

                <button
                  className="button"
                  onClick={() =>
                    navigate(`/driver/ride/${activeRide.id}`)
                  }
                >
                  Go to Ride
                </button>
              </div>
            )}

            <button className="button" onClick={fetchRides}>
              Load Rides
            </button>

            {loading && <p>Loading...</p>}

            {!loading && rides.length === 0 && (
              <p style={{ marginTop: 20 }}>No available rides</p>
            )}

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
                  {ride.source} → {ride.destination}
                </p>
                <p>Status: {ride.status}</p>
                <p>Fare: ₹{ride.totalFare?.toFixed(2)}</p>
                <p>Distance: {ride.distance?.toFixed(2)} km</p>

                <div style={{ marginTop: 10 }}>
                  <button
                    className="button"
                    disabled={hasActiveRide || ride.status !== "CREATED"}
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

                  {ride.status === "ACCEPTED" &&
                    ride.driver?.id === driverId && (
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

                  {ride.status === "STARTED" &&
                    ride.driver?.id === driverId && (
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
          </>
        )}
      </div>
    </>
  );
}

export default DriverDashboard;