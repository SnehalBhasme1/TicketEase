require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const logger = require("./middlewares/logger");

const authRoutes = require("./routes/authRoutes"); // Import auth routes
const ticketRoutes = require("./routes/ticketRoutes");

const app = express(); // Define app here before using routes

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(morgan("dev"));
app.use(logger);

app.use("/api/auth", authRoutes); // Use authentication routes
app.use("/api/tickets", ticketRoutes); // Use ticket routes

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
