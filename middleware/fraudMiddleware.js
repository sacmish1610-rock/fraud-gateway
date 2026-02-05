const User = require("../models/User");

const fraudMiddleware = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    console.log("Fetching user profile from MongoDB...");

    let user = await User.findOne({ userId });

    if (!user) {
      console.log("New user detected — creating default profile");

      user = new User({
        userId,
        country: "IN",
        device: "WEB",
        pastFrauds: 0,
        totalTransactions: 0,
        avgSpend: 0,
        riskTier: "LOW",
      });

      await user.save();
    }

    // 🔥 VERY IMPORTANT FIX — ensure safe defaults
    req.userProfile = {
      userId: user.userId,
      country: user.country || "IN",
      device: user.device || "WEB",
      pastFrauds: user.pastFrauds || 0,
      totalTransactions: user.totalTransactions || 0,
      avgSpend: user.avgSpend || 0,
      riskTier: user.riskTier || "LOW",
    };

    next();
  } catch (error) {
    console.error("Fraud middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = fraudMiddleware;
