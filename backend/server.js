const dotenv = require("dotenv");
dotenv.config();
const app = require("express")();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bookingRoutes = require("./routes/booking_routes");
const venueRoutes = require("./routes/venueroutes");
const db = require("./database/db");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use("/api", bookingRoutes);
app.use("/api", venueRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
