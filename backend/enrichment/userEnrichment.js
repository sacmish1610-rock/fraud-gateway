const User = require("../models/User");

const userEnrichment = async (req) => {
  const { userId } = req.body;

  if (!userId) {
    throw new Error("userId is required");
  }

  const user = await User.findOne({ userId });

  if (!user) {
    return {
      userId,
      riskTier: "LOW",
      pastFrauds: 0,
      totalTransactions: 0,
      avgSpend: 0,
    };
  }

  return user;
};

module.exports = userEnrichment;