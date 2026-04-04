import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          RideShare
        </h2>

        <div>
          <button onClick={() => navigate("/login")}>Login</button>

          <button
            onClick={() => navigate("/register")}
            style={{ marginLeft: 10 }}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h1>RideShare</h1>

        <p>Smart ride sharing platform for users and drivers</p>

        <p style={{ marginTop: 10 }}>
          Share rides. Save money. Travel smarter.
        </p>

        <button
          onClick={() => navigate("/register")}
          style={{ marginTop: 20 }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;