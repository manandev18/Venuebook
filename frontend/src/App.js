import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VenueList from "./components/Venuelistcomponent";
import AdminDashboard from "./components/Admindashboard";
import BookingForm from "./components/bookingfromcomponent";
import "./App.css";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              EazyVenue
            </Link>
            <div className="nav-menu">
              <Link to="/" className="nav-link">
                Browse Venues
              </Link>
              <button
                className={`nav-link admin-toggle ${isAdmin ? "active" : ""}`}
                onClick={() => setIsAdmin(!isAdmin)}
              >
                {isAdmin ? "Switch to User" : "Admin Mode"}
              </button>
              {isAdmin && (
                <Link to="/admin" className="nav-link">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<VenueList />} />
            <Route path="/book/:venueId" element={<BookingForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
