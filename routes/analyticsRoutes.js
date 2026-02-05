const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");

router.get("/analytics/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ---- BASIC COUNTS ----
    const totalTransactions = await Transaction.countDocuments({ userId });

    const totalBlocked = await Transaction.countDocuments({
      userId,
      decision: "BLOCK",
    });

    const totalAllowed = await Transaction.countDocuments({
      userId,
      decision: "ALLOW",
    });

    const totalOtp = await Transaction.countDocuments({
      userId,
      decision: "OTP_REQUIRED",
    });

    const pastFrauds = totalBlocked;

    // ---- LAST 10 TRANSACTIONS ----
    const last10Transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // ---- FRAUD BLOCK RATE ----
    let fraudBlockRate = "0.00%";
    if (totalTransactions > 0) {
      fraudBlockRate =
        ((totalBlocked / totalTransactions) * 100).toFixed(2) + "%";
    }

    // ---- RISK TREND FOR GRAPH ----
    const riskTrendRaw = await Transaction.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          avgRisk: { $avg: "$riskScore" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 7 },
    ]);

    const riskTrend = riskTrendRaw.map((item) => ({
      date: item._id,
      avgRisk: Number(item.avgRisk.toFixed(2)),
    }));

    res.json({
      userId,
      totalTransactions,
      totalAllowed,
      totalBlocked,
      totalOtp,
      pastFrauds,
      currentRiskTier: user.riskTier,
      fraudBlockRate,
      riskTrend,
      last10Transactions,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
