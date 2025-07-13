import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Users, DollarSign } from "lucide-react";
import venueService from "../services/VenueService";

const AdminDashboard = () => {
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("venues");
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const [newVenue, setNewVenue] = useState({
    name: "",
    description: "",
    location: "",
    capacity: "",
    pricePerDay: "",
    amenities: "",
  });

  const [availabilityData, setAvailabilityData] = useState({
    dates: "",
    action: "block",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [venuesData, bookingsData] = await Promise.all([
        venueService.getAllVenues(),
        venueService.getAllBookings(),
      ]);
      setVenues(venuesData);
      setBookings(bookingsData);
    } catch (err) {
      setError("Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVenue = async (e) => {
    e.preventDefault();
    try {
      const venueData = {
        ...newVenue,
        capacity: parseInt(newVenue.capacity),
        pricePerDay: parseFloat(newVenue.pricePerDay),
        amenities: newVenue.amenities
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      };
      console.log("Submitting venueData:", venueData);
      const addedVenue = await venueService.addVenue(venueData);
      setVenues([...venues, addedVenue]);
      setNewVenue({
        name: "",
        description: "",
        location: "",
        capacity: "",
        pricePerDay: "",
        amenities: "",
      });
      setShowAddVenue(false);
    } catch (err) {
      setError("Failed to add venue");
      console.error("Error adding venue:", err);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        await venueService.deleteVenue(venueId);
        setVenues(venues.filter((venue) => venue._id !== venueId));
      } catch (err) {
        setError("Failed to delete venue");
        console.error("Error deleting venue:", err);
      }
    }
  };

  const handleUpdateAvailability = async (e) => {
    e.preventDefault();
    try {
      const dates = availabilityData.dates
        .split(",")
        .map((date) => date.trim());
      await venueService.updateVenueAvailability(selectedVenue._id, {
        dates,
        action: availabilityData.action,
      });

      // Refresh venues data
      const updatedVenues = await venueService.getAllVenues();
      setVenues(updatedVenues);

      setShowAvailabilityModal(false);
      setAvailabilityData({ dates: "", action: "block" });
      setSelectedVenue(null);
    } catch (err) {
      setError("Failed to update availability");
      console.error("Error updating availability:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVenue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailabilityData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUnavailableDatesString = (venue) => {
    if (!venue.unavailableDates || venue.unavailableDates.length === 0) {
      return "No blocked dates";
    }

    return venue.unavailableDates
      .map((item) => `${formatDate(item.date)} (${item.reason})`)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header fade-in">
        <h1>Venue Management</h1>
        <p>Manage your venue listings and track bookings</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">
            ×
          </button>
        </div>
      )}

      <div className="dashboard-tabs slide-in">
        <button
          className={`tab-button ${activeTab === "venues" ? "active" : ""}`}
          onClick={() => setActiveTab("venues")}
        >
          <Calendar size={20} />
          Venues ({venues.length})
        </button>
        <button
          className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          <Users size={20} />
          Bookings ({bookings.length})
        </button>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <h3>{venues.length}</h3>
          <p>Total Venues</p>
        </div>
        <div className="stat-card">
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>${bookings.reduce((sum, booking) => sum + booking.totalAmount, 0).toLocaleString()}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      {activeTab === "venues" && (
        <div className="venues-section">
          <div className="section-header">
            <h2>🏛️ Your Venues</h2>
            <button
              onClick={() => setShowAddVenue(true)}
              className="add-button"
            >
              <Plus size={20} />
              Add New Venue
            </button>
          </div>

          <div className="venues-grid">
            {venues.map((venue) => (
              <div key={venue._id} className="admin-venue-card">
                <div className="venue-header">
                  <h3>{venue.name}</h3>
                  <div className="venue-actions">
                    <button
                      onClick={() => {
                        setSelectedVenue(venue);
                        setShowAvailabilityModal(true);
                      }}
                      className="edit-button"
                      title="Manage Dates & Availability"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteVenue(venue._id)}
                      className="delete-button"
                      title="Delete Venue"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="venue-details">
                  <p>
                    <strong>📍 Location:</strong> {venue.location}
                  </p>
                  <p>
                    <strong>👥 Capacity:</strong> {venue.capacity} guests
                  </p>
                  <p>
                    <strong>💰 Price:</strong> ${venue.pricePerDay.toLocaleString()}/day
                  </p>
                  <p>
                    <strong>📝 Description:</strong> {venue.description}
                  </p>

                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="amenities">
                      <strong>Amenities:</strong>
                      <div className="amenities-list">
                        {venue.amenities.map((amenity, index) => (
                          <span
                            key={venue._id + "-" + amenity + "-" + index}
                            className="amenity-tag"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="availability-info">
                    <strong>🚫 Blocked Dates:</strong>
                    <p className="blocked-dates">
                      {getUnavailableDatesString(venue)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "bookings" && (
        <div className="bookings-section">
          <h2>📅 Recent Bookings</h2>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found.</p>
            </div>
          ) : (
            <div className="bookings-table">
              <table>
                <thead>
                  <tr>
                    <th>👤 Customer</th>
                    <th>🏛️ Venue</th>
                    <th>📅 Event Date</th>
                    <th>💰 Amount</th>
                    <th>📊 Status</th>
                    <th>🕒 Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <div className="customer-info">
                          <strong>{booking.customerName}</strong>
                          <div className="customer-details">
                            <small>{booking.customerEmail}</small>
                            <small>{booking.customerPhone}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        {booking.venueId
                          ? booking.venueId.name
                          : "Unknown Venue"}
                      </td>
                      <td>{formatDate(booking.bookingDate)}</td>
                      <td>${booking.totalAmount.toLocaleString()}</td>
                      <td>
                        <span className={`status ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>{formatDate(booking.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Venue Modal */}
      {showAddVenue && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>🏛️ Add New Venue</h3>
              <button
                onClick={() => setShowAddVenue(false)}
                className="close-button"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddVenue} className="venue-form">
              <div className="form-group">
                <label htmlFor="name">🏛️ Venue Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newVenue.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Grand Ballroom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">📝 Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={newVenue.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Elegant ballroom perfect for weddings and corporate events..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">📍 Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newVenue.location}
                  onChange={handleInputChange}
                  required
                  placeholder="123 Main Street, Downtown"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="capacity">👥 Capacity *</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={newVenue.capacity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="150"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pricePerDay">💰 Price per Day *</label>
                  <input
                    type="number"
                    id="pricePerDay"
                    name="pricePerDay"
                    value={newVenue.pricePerDay}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="2500.00"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="amenities">✨ Amenities</label>
                <input
                  type="text"
                  id="amenities"
                  name="amenities"
                  value={newVenue.amenities}
                  onChange={handleInputChange}
                  placeholder="WiFi, Parking, Sound System, Catering Kitchen"
                />
                <small>Example: WiFi, Parking, Sound System, Catering</small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowAddVenue(false)}>
                  Cancel
                </button>
                <button type="submit">🎉 Add Venue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Availability Management Modal */}
      {showAvailabilityModal && selectedVenue && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>📅 Manage Availability - {selectedVenue.name}</h3>
              <button
                onClick={() => {
                  setShowAvailabilityModal(false);
                  setSelectedVenue(null);
                  setAvailabilityData({ dates: "", action: "block" });
                }}
                className="close-button"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleUpdateAvailability}
              className="availability-form"
            >
              <div className="form-group">
                <label htmlFor="action">🔧 Action</label>
                <select
                  id="action"
                  name="action"
                  value={availabilityData.action}
                  onChange={handleAvailabilityChange}
                >
                  <option value="block">Block Dates</option>
                  <option value="unblock">Unblock Dates</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dates">📅 Dates</label>
                <input
                  type="text"
                  id="dates"
                  name="dates"
                  value={availabilityData.dates}
                  onChange={handleAvailabilityChange}
                  placeholder="Enter dates separated by commas (YYYY-MM-DD)"
                  required
                />
                <small>Example: 2024-12-25, 2024-12-26, 2024-12-31</small>
              </div>

              <div className="current-blocked-dates">
                <h4>🚫 Currently Blocked Dates:</h4>
                <p>{getUnavailableDatesString(selectedVenue)}</p>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowAvailabilityModal(false);
                    setSelectedVenue(null);
                    setAvailabilityData({ dates: "", action: "block" });
                  }}
                >
                  Cancel
                </button>
                <button type="submit">💾 Update Availability</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
