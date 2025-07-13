const router = require("express").Router();
const Booking = require("../database/Booking");
const Venue = require("../database/Venue");

// Create a new booking
router.post("/bookings", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    console.log("Booking venueid:", booking.venueid);
    const venue = await Venue.findById(booking.venueid);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    // Ensure unavailableDates is always an array
    if (!Array.isArray(venue.unavailableDates)) {
      venue.unavailableDates = [];
    }
    // Check if the booking date is available
    const isBooked = venue.unavailableDates.some(
      (dateObj) =>
        new Date(dateObj.date).toISOString() ===
        new Date(booking.bookingDate).toISOString()
    );
    if (isBooked) {
      return res.status(400).json({ error: "Date is not available" });
    }
    await booking.save();
    venue.unavailableDates.push({
      date: booking.bookingDate,
      reason: "booked",
    });
    await venue.save();
    res.status(201).json({ booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get bookings for a specific venue
router.get("/venues/:venueId/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find({ venueid: req.params.venueId });
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// Delete venue
router.delete("/venues/:venueId", async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.venueId);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
