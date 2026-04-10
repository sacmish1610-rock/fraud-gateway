const cors = require("cors");
const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

// 🔥 Enrichment Pipeline
const enrichmentPipeline = require("./enrichment/enrichmentPipeline");

// 🔥 Middleware
const loggerMiddleware = require("./middleware/loggerMiddleware");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// 🔥 Core Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware); // 👈 FIRST (logs everything)

// Health route
app.get("/", (req, res) => {
  res.send("🚀 Fraud Gateway Enrichment Server Running...");
});

// 🔥 Enrichment Layer
app.use(enrichmentPipeline);

// Routes
app.use("/api", paymentRoutes);

// 🔥 Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// 🔥 Start Server after DB connect
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();