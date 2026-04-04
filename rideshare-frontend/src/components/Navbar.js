import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [balance, setBalance] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [showSidebar, setShowSidebar] = useState(false);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ✅ Fetch wallet
  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/users/wallet?userId=${user.id}`
      );
      const data = await res.json();
      setBalance(data.balance);
    } catch (err) {
      console.error("Wallet error:", err);
    }
  };

  // ✅ Notifications polling
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/users/notifications?userId=${user.id}`
      );

      const data = await res.json();

      // ✅ show all notifications in console (no alert bug)
      data.forEach((n) => {
        console.log("Notification:", n.message);
      });

      setNotifications(data);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  // ✅ Unread count
  const unseenCount = notifications.length;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        RideShare
      </h2>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          
          {/* User + Wallet */}
          <span>
            {user.name} ({user.role}) | ₹{balance}
          </span>

          {/* Wallet */}
          <button onClick={() => navigate("/wallet")}>
            Wallet
          </button>

          {/* Notifications */}
          <button
            onClick={() => {
              setShowSidebar(true);
            }}
          >
            {unseenCount > 0
              ? `Notifications (${unseenCount})`
              : "Notifications"}
          </button>

          {/* Logout */}
          <button onClick={logout}>
            Logout
          </button>
        </div>
      )}

      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)"
          }}
        />
      )}

      {showSidebar && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "300px",
            height: "100%",
            background: "#fff",
            boxShadow: "-2px 0 10px rgba(0,0,0,0.2)",
            padding: "20px",
            overflowY: "auto",
            zIndex: 1000
          }}
        >
          <h3>Notifications</h3>

          <button
            onClick={() => setShowSidebar(false)}
            style={{ marginBottom: 10 }}
          >
            Close
          </button>

          {notifications.length === 0 && <p>No notifications</p>}

          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                background: "#f5f5f5",
                borderRadius: "6px"
              }}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navbar;