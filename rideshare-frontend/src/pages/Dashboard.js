import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // CREATE RIDE
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("4_SEATER");
  const [hostSeats, setHostSeats] = useState(1);

  // SEARCH
  const [searchSource, setSearchSource] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [rides, setRides] = useState([]);

  const [availableRides, setAvailableRides] = useState([]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };


  const fetchAvailableRides = async () => {
    try {
      const res = await fetch("http://localhost:8080/rides/available");
      const data = await res.json();
      setAvailableRides(data);
    } catch (err) {
      alert("Error fetching rides");
    }
  };


  const acceptRide = async (rideId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/rides/accept?rideId=${rideId}&driverId=${user.id}`,
        { method: "POST" }
      );

      const data = await res.json();
      alert("Ride accepted: " + data.id);

      fetchAvailableRides(); // refresh
    } catch (err) {
      alert("Error accepting ride");
    }
  };

  const createRide = async () => {
    try {
      const res = await fetch("http://localhost:8080/rides/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source,
          destination,
          vehicleType,
          hostSeats,
          host: { id: user.id }
        })
      });

      const data = await res.json();
      alert("Ride created with ID: " + data.id);
    } catch (err) {
      alert("Error creating ride");
    }
  };

  const searchRides = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/rides/search?source=${searchSource}&destination=${searchDestination}`
      );

      const data = await res.json();
      setRides(data);
    } catch (err) {
      alert("Error fetching rides");
    }
  };

  const joinRide = async (rideId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/rides/join?rideId=${rideId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ id: user.id })
        }
      );

      const msg = await res.text();
      alert(msg);
    } catch (err) {
      alert("Error joining ride");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <h2>RideShare</h2>

        <div>
          <span style={{ marginRight: 20 }}>
            {user.name} ({user.role})
          </span>

          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <h3>Welcome, {user.name}</h3>

        {user.role === "USER" && (
          <>
            <p>You can create and join rides.</p>

            <div className="row">

              {/* CREATE RIDE */}
              <div className="card">
                <h4>Create Ride</h4>

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

                <select
                  className="input"
                  onChange={(e) => setVehicleType(e.target.value)}
                >
                  <option value="3_SEATER">3 Seater</option>
                  <option value="4_SEATER">4 Seater</option>
                  <option value="5_SEATER">5 Seater</option>
                  <option value="7_SEATER">7 Seater</option>
                </select>

                <input
                  className="input"
                  type="number"
                  placeholder="Host Seats"
                  onChange={(e) => setHostSeats(e.target.value)}
                />

                <button className="button" onClick={createRide}>
                  Create Ride
                </button>
              </div>

            </div>  

            {/* SEARCH RIDE */}
            <div className="card">
              <h4>Search Rides</h4>

              <input
                className="input"
                placeholder="Source"
                onChange={(e) => setSearchSource(e.target.value)}
              />

              <input
                className="input"
                placeholder="Destination"
                onChange={(e) => setSearchDestination(e.target.value)}
              />

              <button className="button" onClick={searchRides}>
                Search
              </button>
            </div>

            {/* RIDE LIST */}
            <div style={{ marginTop: 20 }}>
              {rides.map((ride) => (
                <div key={ride.id} className="card">
                  <p><b>{ride.source}</b> → {ride.destination}</p>
                  <p>Seats: {ride.availableSeats}</p>
                  <p>Fare: {ride.totalFare}</p>

                  <button
                    className="button"
                    onClick={() => joinRide(ride.id)}
                  >
                    Join Ride
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {user.role === "DRIVER" && (
          <>
            <p>You can accept and drive rides.</p>

            <button className="button" onClick={fetchAvailableRides}>
              Load Available Rides
            </button>

            <div style={{ marginTop: 20 }}>
              {availableRides.map((ride) => (
                <div key={ride.id} className="card">
                  <p><b>{ride.source}</b> → {ride.destination}</p>
                  <p>Seats: {ride.availableSeats}</p>

                  <button
                    className="button"
                    onClick={() => acceptRide(ride.id)}
                  >
                    Accept Ride
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;