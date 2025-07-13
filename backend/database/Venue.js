const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const venueSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  unavailableDates: [
    {
      date: {
        type: Date,
        required: true,
      },
      reason: {
        type: String,
        enum: ["booked", "blocked", "maintenance"],
        default: "blocked",
      },
    },
  ],
});

const Venue = mongoose.model("Venue", venueSchema);
module.exports = Venue;
