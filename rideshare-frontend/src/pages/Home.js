import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Navbar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        borderBottom: "1px solid #ddd"
      }}>
        <h2>RideShare</h2>

        <div>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")} style={{ marginLeft: 10 }}>
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h1>Share Rides. Save Money.</h1>
        <p>Find or offer rides easily and travel smarter.</p>

        <button onClick={() => navigate("/register")} style={{ marginTop: 20 }}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;