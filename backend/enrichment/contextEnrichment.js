const contextEnrichment = async () => {
  return {
    env: process.env.NODE_ENV || "development",
    riskThreshold: process.env.RISK_THRESHOLD || 0.7,
  };
};

module.exports = contextEnrichment;