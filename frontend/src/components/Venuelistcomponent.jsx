import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Users, DollarSign, Calendar } from "lucide-react";
import venueService from "../services/VenueService";

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const data = await venueService.getAllVenues();
      setVenues(data);
    } catch (err) {
      setError("Failed to fetch venues");
      console.error("Error fetching venues:", err);
    } finally {
      setLoading(false);
    }
  };

  const isVenueAvailable = (venue, date) => {
    if (!date) return true;

    const checkDate = new Date(date).toISOString().split("T")[0];
    return !venue.unavailableDates.some(
      (unavailableDate) =>
        new Date(unavailableDate.date).toISOString().split("T")[0] === checkDate
    );
  };

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate
      ? isVenueAvailable(venue, selectedDate)
      : true;

    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchVenues} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="venue-list-container">
      <div className="venue-list-header fade-in">
        <h1>Find Perfect Venues for Your Events</h1>
        <p>Book the best venues across the city for weddings, parties, corporate events and more</p>
      </div>

      <div className="filters-container slide-in">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search by venue name, location, or amenities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="date-filter">
          <label htmlFor="date-filter">📅 Available on:</label>
          <input
            id="date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="date-input"
          />
        </div>
        
        {(searchTerm || selectedDate) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedDate("");
            }}
            className="clear-filters-button"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredVenues.length === 0 ? (
        <div className="no-venues">
          <p>No venues found matching your criteria.</p>
          <p>Try adjusting your search criteria or browse all available venues.</p>
        </div>
      ) : (
        <div className="venues-grid">
          {filteredVenues.map((venue) => (
            <div key={venue._id} className="venue-card">
              <div className="venue-image">
                {venue.images && venue.images.length > 0 ? (
                  <img
                    src={venue.images[0]}
                    alt={venue.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="placeholder-image">
                    <Calendar size={48} />
                    <p>No Image Available</p>
                  </div>
                )}
              </div>

              <div className="venue-info">
                <h3 className="venue-name">{venue.name}</h3>
                <p className="venue-description" title={venue.description}>{venue.description}</p>

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

                {venue.amenities && venue.amenities.length > 0 && (
                  <div className="amenities">
                    <h4>✨ Featured Amenities:</h4>
                    <div className="amenities-list">
                      {venue.amenities.slice(0, 4).map((amenity, index) => (
                        <span key={index} className="amenity-tag">
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 4 && (
                        <span className="amenity-tag" style={{background: 'var(--text-light)'}}>
                          +{venue.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="venue-actions">
                  <Link
                    to={`/book/${venue._id}`}
                    className="book-button"
                    state={{ venue }}
                  >
                    Book This Venue
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueList;
