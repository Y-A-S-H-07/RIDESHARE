import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "15px 30px",
      borderBottom: "1px solid #ddd"
    }}>
      <h2>RideShare</h2>

      {user && (
        <div>
          <span style={{ marginRight: 20 }}>
            {user.name} ({user.role})
          </span>

          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Navbar;