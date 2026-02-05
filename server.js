const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fraudMiddleware = require("./middleware/fraudMiddleware");

const paymentRoutes = require("./routes/paymentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const otpRoutes = require("./routes/otpRoutes");

dotenv.config();
const app = express();

app.use(express.json());

// Connect to MongoDB only
connectDB();

// Global fraud enrichment middleware (without Redis)
app.use(fraudMiddleware);

// Routes
app.use("/api", paymentRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", otpRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
