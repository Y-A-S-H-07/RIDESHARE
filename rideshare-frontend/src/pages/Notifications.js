import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Notifications() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await fetch(
      `http://localhost:8080/users/notifications?userId=${user.id}`
    );

    const data = await res.json();
    setNotifications(data);
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Notifications</h2>

        {notifications.length === 0 && <p>No notifications</p>}

        {notifications.map((n) => (
          <div key={n.id} className="card">
            <p>{n.message}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Notifications;