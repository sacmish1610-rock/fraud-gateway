const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Helper to generate transaction ID
const generateTxnId = () =>
  "TXN-" + Date.now() + Math.floor(Math.random() * 1000);

router.post("/pay", async (req, res) => {
  try {
    const { userId, amount, merchant } = req.body;

    if (!userId || !amount || !merchant) {
      return res.status(400).json({
        message: "userId, amount, and merchant are required",
      });
    }

    // 🔥 SAFE EXTRACTION WITH DEFAULTS (THIS FIXES YOUR ERROR)
    const userProfile = req.userProfile || {};

    const pastFrauds = userProfile.pastFrauds ?? 0;
    const totalTransactions = userProfile.totalTransactions ?? 0;
    const avgSpend = userProfile.avgSpend ?? 0;

    // ---- Velocity check: transactions in last 1 minute ----
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const recentTxnsInLastMinute = await Transaction.countDocuments({
      userId,
      createdAt: { $gte: oneMinuteAgo },
    });

    // --------- RULE-BASED SCORE ----------
    let ruleScore = 0;

    if (amount > 100000) ruleScore += 0.4;
    if (pastFrauds > 0) ruleScore += 0.3;
    if (recentTxnsInLastMinute >= 2) ruleScore += 0.3;

    // --------- SIMULATED ML SCORE ----------
    const mlScore = Math.min(1, Math.random());

    const finalRisk = 0.6 * ruleScore + 0.4 * mlScore;

    let decision = "ALLOW";
    if (finalRisk > 0.8) decision = "BLOCK";
    else if (finalRisk > 0.5) decision = "OTP_REQUIRED";

    const txnId = generateTxnId();

    // Save transaction
    const transaction = await Transaction.create({
      txnId,
      userId,
      amount,
      merchant,
      riskScore: finalRisk,
      decision,
    });

    // ---- Update User Profile Safely ----
    const user = await User.findOne({ userId });

    if (user) {
      user.totalTransactions = (user.totalTransactions || 0) + 1;

      if (decision === "BLOCK") {
        user.pastFrauds = (user.pastFrauds || 0) + 1;
      }

      // Update average spend
      user.avgSpend =
        (user.avgSpend * (user.totalTransactions - 1) + amount) /
        user.totalTransactions;

      // Update risk tier
      if (user.pastFrauds > 2) user.riskTier = "HIGH";
      else if (user.pastFrauds > 0) user.riskTier = "MEDIUM";
      else user.riskTier = "LOW";

      await user.save();
    }

    res.json({
      message: "Payment evaluated",
      riskScore: finalRisk,
      decision,
      recentTxnsInLastMinute,
      transaction,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      message: "Payment failed",
      error: error.message,
    });
  }
});

module.exports = router;
