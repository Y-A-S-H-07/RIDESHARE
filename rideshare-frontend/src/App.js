import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import CreateRide from "./pages/CreateRide";
import SearchRide from "./pages/SearchRide";
import History from "./pages/History";
import RideDetails from "./pages/RideDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/create-ride" element={<CreateRide />} />
        <Route path="/search-ride" element={<SearchRide />} />
        <Route path="/history" element={<History />} />
        <Route path="/ride-details" element={<RideDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;