const router = require("express").Router();
const Venue = require("../database/Venue");

// Create a new venue
router.post("/venues", async (req, res) => {
  console.log("Received venue POST body:", req.body);
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json({ venue });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all venues
router.get("/venues", async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json({ venues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single venue by ID
router.get("/venues/:id", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.status(200).json({ venue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a venue by ID
router.patch("/venues/:id/availability", async (req, res) => {
  try {
    const { date, action } = req.body;
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    if (action === "book") {
      venue.unavailableDates.push({ date, reason: "booked" });
    } else if (action === "unblock") {
      venue.unavailableDates = venue.unavailableDates.filter(
        (d) => d.date !== date
      );
    } else if (action == "blocked") {
      const newavailableDate = date.map((date) => ({
        date: new Date(date),
        reason: "blocked",
      }));
      venue.unavailableDates.push(...newavailableDate);
    }
    await venue.save();
    res.json(venue);
    res.status(200).send(venue);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a venue by ID
router.delete("/:id", async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found" });
    }
    res.status(200).json({ venue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check availability of a venue for a specific date
router.get("/venues/:id/availability", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).send();
    }
    const { date } = req.query;
    const isAvailable = !venue.unavailableDates.some(
      (d) => d.date.toISOString() === new Date(date).toISOString()
    );
    res.status(200).json({ available: isAvailable });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
