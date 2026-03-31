import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [myRides, setMyRides] = useState([]);

  // ✅ Fetch my rides
  const fetchMyRides = async () => {
    const res = await fetch("http://localhost:8080/rides/all");
    const data = await res.json();

    const filtered = data.filter(
      (ride) => ride.host?.id === user.id
    );

    setMyRides(filtered);
  };

  // ✅ Load on page start
  useEffect(() => {
    fetchMyRides();
  }, []);

  // ✅ Fetch requests
  const fetchRequests = async (rideId) => {
    const res = await fetch("http://localhost:8080/rides/all");
    const data = await res.json();

    const ride = data.find((r) => r.id === rideId);

    ride.requests = ride.participants || [];

    setMyRides((prev) =>
      prev.map((r) => (r.id === rideId ? ride : r))
    );
  };

  // ✅ Accept request
  const acceptRequest = async (rideId, userId) => {
    await fetch(
      `http://localhost:8080/rides/accept-request?rideId=${rideId}&userId=${userId}&hostId=${user.id}`,
      { method: "POST" }
    );

    fetchMyRides();
  };

  // ✅ Reject request
  const rejectRequest = async (rideId, userId) => {
    await fetch(
      `http://localhost:8080/rides/reject-request?rideId=${rideId}&userId=${userId}&hostId=${user.id}`,
      { method: "POST" }
    );

    fetchMyRides();
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="title">Welcome, {user.name}</h1>

        <p className="subtitle">
          Easily create rides or find available rides shared by others.
        </p>

        <div className="row" style={{ marginTop: 40 }}>
          
          {/* Create Ride */}
          <div className="card">
            <h3>Create Ride</h3>
            <p>Create and offer rides to others.</p>

            <button
              className="button"
              onClick={() => navigate("/create-ride")}
            >
              Go to Create Ride
            </button>
          </div>

          {/* Search Ride */}
          <div className="card">
            <h3>Search Ride</h3>
            <p>Find rides from other users.</p>

            <button
              className="button"
              onClick={() => navigate("/search-ride")}
            >
              Go to Search Ride
            </button>
          </div>

          {/* Ride History */}
          <div className="card">
            <h3>Ride History</h3>
            <p>View your completed or cancelled rides.</p>

            <button
              className="button"
              onClick={() => navigate("/history")}
            >
              View Ride History
            </button>
          </div>

        </div>

        {/* ✅ MY RIDES SECTION */}
        <h3 style={{ marginTop: 40 }}>My Rides</h3>

        {myRides.map((ride) => (
          <div key={ride.id} className="card">
            <p>
              {ride.source} → {ride.destination}
            </p>
            <p>Status: {ride.status}</p>

            <button
              className="button"
              onClick={() => fetchRequests(ride.id)}
            >
              View Requests
            </button>

            {/* Requests */}
            {ride.requests &&
              ride.requests.map((req) => (
                <div key={req.id} style={{ marginTop: 10 }}>
                  <p>User ID: {req.user.id}</p>

                  <button
                    className="button"
                    onClick={() =>
                      acceptRequest(ride.id, req.user.id)
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="button"
                    onClick={() =>
                      rejectRequest(ride.id, req.user.id)
                    }
                  >
                    Reject
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default UserDashboard;