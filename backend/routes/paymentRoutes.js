const express = require("express");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const router = express.Router();

// ===============================
// 🔥 HYBRID RISK ENGINE (UPGRADED)
// ===============================
const calculateRisk = (user, amount, transaction, context, external) => {
  let ruleScore = 0;

  // Amount-based risk
  if (amount > 10000) ruleScore += 0.2;
  if (amount > 30000) ruleScore += 0.3;
  if (amount > 70000) ruleScore += 0.4;

  // User history risk
  if (user.pastFrauds > 0) ruleScore += 0.4;
  if (user.pastFrauds > 2) ruleScore += 0.6;

  // Velocity (from enrichment)
  if (transaction.txnCountLastMinute >= 2) ruleScore += 0.3;
  if (transaction.txnCountLastMinute >= 4) ruleScore += 0.4;

  // 🌍 External risk (NEW 🔥)
  if (external.highRiskCountries?.includes("India")) {
    ruleScore += 0.1;
  }

  // ⚙️ Context-based tuning (ENV driven 🔥)
  const thresholdMultiplier =
    context.env === "production" ? 1.2 : 1;

  // 🤖 Simulated ML score
  const mlScore =
    0.35 * (amount / 100000) +
    0.35 * (user.pastFrauds / 5) +
    0.30 * (transaction.txnCountLastMinute / 10);

  const finalRisk =
    thresholdMultiplier * (0.6 * ruleScore + 0.4 * mlScore);

  return Math.min(finalRisk, 1);
};

// ===============================
// 🚀 MAIN PAYMENT ROUTE
// ===============================
router.post("/pay", async (req, res) => {
  try {
    const { userId, amount, merchant } = req.body;

    if (!userId || !amount || !merchant) {
      return res.status(400).json({
        message: "userId, amount, and merchant are required",
      });
    }

    // 🔥 Use enriched data
    const { user, transaction, context, external } =
      req.enrichedData;

    console.log("📊 Enriched Data:", req.enrichedData);

    // 🔥 Risk calculation
    const riskScore = calculateRisk(
      user,
      amount,
      transaction,
      context,
      external
    );

    // 🔥 Decision Engine
    let decision;

    if (riskScore > 0.8) {
      decision = "BLOCK";
    } else if (riskScore > 0.5) {
      decision = "OTP_REQUIRED";
    } else {
      decision = "ALLOW";
    }

    // 🔥 Save transaction
    const txn = await Transaction.create({
      txnId: "TXN-" + Date.now(),
      userId,
      amount,
      merchant,
      riskScore,
      decision,
    });

    // 🔥 Update user profile
    await User.findOneAndUpdate(
      { userId },
      {
        $inc: {
          totalTransactions: 1,
          pastFrauds: decision === "BLOCK" ? 1 : 0,
        },
        $set: {
          avgSpend: (amount + (user.avgSpend || 0)) / 2,
          riskTier:
            riskScore > 0.8
              ? "HIGH"
              : riskScore > 0.5
              ? "MEDIUM"
              : "LOW",
        },
      },
      { upsert: true, new: true }
    );

    // 🔥 Response
    res.status(201).json({
      message: "Payment evaluated",
      riskScore,
      decision,
      enrichedData: req.enrichedData,
      transaction: txn,
    });

  } catch (error) {
    console.error("❌ Payment Error:", error);
    res.status(500).json({
      message: "Payment failed",
      error: error.message,
    });
  }
});

module.exports = router;