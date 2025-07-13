import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Users, DollarSign, Calendar, ArrowLeft } from "lucide-react";
import venueService from "../services/VenueService";

const BookingForm = () => {
  const { venueId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(location.state?.venue || null);
  const [loading, setLoading] = useState(!venue);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    bookingDate: "",
  });

  useEffect(() => {
    if (!venue) {
      fetchVenue();
    }
  }, [venueId, venue]);

  const fetchVenue = async () => {
    try {
      setLoading(true);
      const data = await venueService.getVenueById(venueId);
      setVenue(data);
    } catch (err) {
      setError("Failed to fetch venue details");
      console.error("Error fetching venue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isDateAvailable = (date) => {
    if (!venue || !date) return true;

    const checkDate = new Date(date).toISOString().split("T")[0];
    return !venue.unavailableDates.some(
      (unavailableDate) =>
        new Date(unavailableDate.date).toISOString().split("T")[0] === checkDate
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Check if date is available
      if (!isDateAvailable(formData.bookingDate)) {
        throw new Error("Selected date is not available");
      }

      const bookingData = {
        venueid: venueId,
        cusotmmername: formData.customerName, // typo matches backend schema
        customeremail: formData.customerEmail, // typo matches backend schema
        customerPhone: formData.customerPhone,
        bookingDate: formData.bookingDate,
        totalAmount: venue.pricePerDay,
        status: "Confirmed", // must match enum in backend
      };

      await venueService.bookVenue(bookingData);
      setSuccess(true);

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        bookingDate: "",
      });

      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to book venue");
      console.error("Error booking venue:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading venue details...</p>
      </div>
    );
  }

  if (error && !venue) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchVenue} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="success-container">
        <div className="success-message">
          <h2>Booking Confirmed!</h2>
          <p>Your booking for {venue.name} has been successfully confirmed.</p>
          <p>You will be redirected to the home page shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form-container">
      <div className="booking-header fade-in">
        <button onClick={() => navigate("/")} className="back-button">
          <ArrowLeft size={20} />
          Back to Venues
        </button>
        <h1>Complete Your Booking</h1>
      </div>

      <div className="booking-content slide-in">
        <div className="venue-summary">
          <h2>{venue.name}</h2>
          
          {venue.images && venue.images.length > 0 && (
            <div className="venue-image" style={{height: '200px', marginBottom: '1.5rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden'}}>
              <img
                src={venue.images[0]}
                alt={venue.name}
                style={{width: '100%', height: '100%', objectFit: 'cover'}}
                loading="lazy"
              />
            </div>
          )}
          
          <div className="venue-details">
            <div className="detail-item">
              <MapPin size={16} />
              <span>{venue.location}</span>
            </div>

            <div className="detail-item">
              <Users size={16} />
              <span>Up to {venue.capacity} guests</span>
            </div>

            <div className="detail-item">
              <DollarSign size={16} />
              <span>${venue.pricePerDay.toLocaleString()}/day</span>
            </div>
          </div>

          <p className="venue-description">{venue.description}</p>

          {venue.amenities && venue.amenities.length > 0 && (
            <div className="amenities">
              <h4>✨ Included Amenities:</h4>
              <div className="amenities-list">
                {venue.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="booking-form">
          <h3>📋 Your Information</h3>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Full Name *</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerEmail">Email Address *</label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="customerPhone">Phone Number *</label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                required
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bookingDate">Event Date *</label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
              {formData.bookingDate &&
                !isDateAvailable(formData.bookingDate) && (
                  <p className="date-error">
                    This date is not available. Please select another date.
                  </p>
                )}
              {formData.bookingDate && isDateAvailable(formData.bookingDate) && (
                <p style={{color: 'var(--accent-color)', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '500'}}>
                  ✅ This date is available!
                </p>
              )}
            </div>

            <div className="booking-summary">
              <div className="summary-item">
                <span>Venue:</span>
                <span>{venue.name}</span>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <span>{formData.bookingDate || "Not selected"}</span>
              </div>
              <div className="summary-item">
                <span>Total Amount:</span>
                <span>${venue.pricePerDay.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={submitting || !isDateAvailable(formData.bookingDate)}
            >
              {submitting ? "Processing..." : "🎉 Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
