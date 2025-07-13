import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

const venueService = {
  // Get all venues
  getAllVenues: async () => {
    try {
      const response = await api.get("/venues");
      // If backend returns { venues: [...] }, return only the array
      return response.data.venues || response.data;
    } catch (error) {
      throw new Error(error.error || "Failed to fetch venues");
    }
  },

  // Get venue by ID
  getVenueById: async (id) => {
    try {
      const response = await api.get(`/venues/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.error || "Failed to fetch venue");
    }
  },

  // Add new venue
  addVenue: async (venueData) => {
    try {
      const response = await api.post("/venues", venueData);
      return response.data;
    } catch (error) {
      throw new Error(error.error || "Failed to add venue");
    }
  },

  // Update venue availability
  updateVenueAvailability: async (venueId, availabilityData) => {
    try {
      const response = await api.put(
        `/venues/${venueId}/availability`,
        availabilityData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.error || "Failed to update venue availability");
    }
  },

  // Check venue availability for a specific date
  checkVenueAvailability: async (venueId, date) => {
    try {
      const response = await api.get(`/venues/${venueId}/availability/${date}`);
      return response.data;
    } catch (error) {
      throw new Error(error.error || "Failed to check venue availability");
    }
  },

  // Book a venue
  bookVenue: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      throw new Error(error.error || "Failed to book venue");
    }
  },

  // Get all bookings
  getAllBookings: async () => {
    try {
      const response = await api.get("/bookings");
      // If backend returns { bookings: [...] }, return only the array
      return response.data.bookings || response.data;
    } catch (error) {
      throw new Error(error.error || "Failed to fetch bookings");
    }
  },

  // Get bookings for a specific venue
  getVenueBookings: async (venueId) => {
    try {
      const response = await api.get(`/venues/${venueId}/bookings`);
      return response.data;
    } catch (error) {
      throw new Error(error.error || "Failed to fetch venue bookings");
    }
  },

  // Delete venue
  deleteVenue: async (venueId) => {
    try {
      const response = await api.delete(`/venues/${venueId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.error || "Failed to delete venue");
    }
  },
};

export default venueService;
