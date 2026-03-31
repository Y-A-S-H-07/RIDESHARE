import React, { useState } from "react";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";
function CreateRide() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("4_SEATER");
  const [hostSeats, setHostSeats] = useState(1);

  const createRide = async () => {
    const res = await fetch("http://localhost:8080/rides/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source,
        destination,
        vehicleType,
        hostSeats,
        host: { id: user.id }
      })
    });

    const data = await res.json();
    alert("Ride created: " + data.id);
  };

    return (
    <>
        <Navbar />
            <div className="container">

                <h2>Create Ride</h2>

                <div className="card">
                    <input className="input" placeholder="Source" onChange={(e) => setSource(e.target.value)} />
                    <input className="input" placeholder="Destination" onChange={(e) => setDestination(e.target.value)} />

                    <select className="input" onChange={(e) => setVehicleType(e.target.value)}>
                    <option value="3_SEATER">3 Seater</option>
                    <option value="4_SEATER">4 Seater</option>
                    <option value="5_SEATER">5 Seater</option>
                    <option value="7_SEATER">7 Seater</option>
                    </select>

                    <input className="input" type="number" placeholder="Host Seats" onChange={(e) => setHostSeats(e.target.value)} />

                    <button className="button" onClick={createRide}>
                    Create Ride
                    </button>
                </div>
            </div>
        </>
    );
}

export default CreateRide;