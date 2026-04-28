// transaction enrichment
const Transaction = require("../models/Transaction");

const transactionEnrichment = async (req) => {
  const { userId } = req.body;

  const recentTxns = await Transaction.find({
    userId,
    timestamp: { $gte: new Date(Date.now() - 60000) },
  });

  return {
    txnCountLastMinute: recentTxns.length,
  };
};

module.exports = transactionEnrichment;