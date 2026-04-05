import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function SearchRide() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [rides, setRides] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const fetchLocations = async (query, setSuggestions) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`,
        {
          headers: { "User-Agent": "ride-sharing-app" }
        }
      );

      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Location error:", err);
    }
  };

  const searchRides = async () => {
    if (!source || !destination) {
      toast.error("Please enter source and destination");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/rides/search?source=${source}&destination=${destination}`
      );

      const data = await res.json();
      setRides(data);
      setSearched(true);
    } catch (err) {
      toast.error("Failed to fetch rides");
    }

    setLoading(false);
  };

  const joinRide = async (rideId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/rides/join?rideId=${rideId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user.id })
        }
      );

      const message = await res.text();
      toast.success(message);
    } catch (err) {
      toast.error("Failed to join ride");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">

          {/* HEADER */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Search Ride
          </h1>

          {/* SEARCH BOX */}
          <div className="bg-white p-5 rounded-xl border space-y-4">

            {/* SOURCE */}
            <div>
              <input
                className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Enter source"
                value={source}
                onChange={(e) => {
                  const value = e.target.value;
                  setSource(value);
                  fetchLocations(value, setSourceSuggestions);
                }}
              />

              {sourceSuggestions.length > 0 && (
                <div className="border rounded-md mt-1 bg-white">
                  {sourceSuggestions.map((place, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm text-gray-900"
                      onClick={() => {
                        setSource(place.display_name);
                        setSourceSuggestions([]);
                      }}
                    >
                      {place.display_name.split(",").slice(0, 2).join(", ")}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DESTINATION */}
            <div>
              <input
                className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Enter destination"
                value={destination}
                onChange={(e) => {
                  const value = e.target.value;
                  setDestination(value);
                  fetchLocations(value, setDestinationSuggestions);
                }}
              />

              {destinationSuggestions.length > 0 && (
                <div className="border rounded-md mt-1 bg-white">
                  {destinationSuggestions.map((place, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-gray-200 cursor-pointer text-sm text-gray-900"
                      onClick={() => {
                        setDestination(place.display_name);
                        setDestinationSuggestions([]);
                      }}
                    >
                      {place.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BUTTON */}
            <button
              className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition active:scale-95"
              onClick={searchRides}
            >
              Search
            </button>
          </div>

          {/* RESULTS */}
          <div className="mt-8 space-y-5">

            {loading && (
              <div className="flex justify-center mt-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
            )}

            {searched && !loading && rides.length === 0 && (
              <p className="text-center text-gray-400 mt-6">
                No rides found for this route
              </p>
            )}

            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white p-5 rounded-xl border hover:shadow-md transition cursor-pointer"
                onClick={() =>
                  navigate("/ride-details", { state: ride })
                }
              >
                <p className="font-medium text-gray-900">
                  {ride.source} → {ride.destination}
                </p>

                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  <p>Fare: ₹{ride.totalFare?.toFixed(2)}</p>
                  <p>Distance: {ride.distance?.toFixed(1)} km</p>
                  <p>Seats: {ride.availableSeats}</p>
                  <p>Status: {ride.status}</p>
                </div>

                <button
                  className="mt-3 px-4 py-1.5 border rounded-md hover:bg-gray-100 text-sm active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    joinRide(ride.id);
                  }}
                >
                  Join Ride
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default SearchRide;