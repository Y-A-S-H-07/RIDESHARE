import React, { useState } from "react";
import "../styles/dashboard.css";

import Navbar from "../components/Navbar";

function SearchRide() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [rides, setRides] = useState([]);

  const searchRides = async () => {
    const res = await fetch(
      `http://localhost:8080/rides/search?source=${source}&destination=${destination}`
    );

    const data = await res.json();
    setRides(data);
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

        <div className="card">
            <input className="input" placeholder="Source" onChange={(e) => setSource(e.target.value)} />
            <input className="input" placeholder="Destination" onChange={(e) => setDestination(e.target.value)} />

            <button className="button" onClick={searchRides}>
            Search
            </button>
        </div>

        <div style={{ marginTop: 20 }}>
            {rides.map((ride) => (
            <div key={ride.id} className="card">
                <p><b>{ride.source}</b> → {ride.destination}</p>
                <p>Seats: {ride.availableSeats}</p>

                <button className="button" onClick={() => joinRide(ride.id)}>
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