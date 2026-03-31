import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function History() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    const res = await fetch("http://localhost:8080/rides/all");
    const data = await res.json();

    // only show user's rides
    const myRides = data.filter(
      (ride) => ride.host?.id === user.id
    );

    setRides(myRides);
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>My Ride History</h2>

        {rides.map((ride) => (
          <div key={ride.id} className="card">
            <p><b>{ride.source}</b> → {ride.destination}</p>
            <p>Status: {ride.status}</p>
            <p>Fare: {ride.totalFare}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default History;