// enrichmentpipeline
const contextEnrichment = require("./contextEnrichment");
const userEnrichment = require("./userEnrichment");
const transactionEnrichment = require("./transactionEnrichment");
const externalEnrichment = require("./externalEnrichment");

const cache = new Map();

const enrichmentPipeline = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // 🔥 Lazy Loading (Cache)
    if (cache.has(userId)) {
      console.log("⚡ Serving from cache");
      req.enrichedData = cache.get(userId);
      return next();
    }

    console.log("📡 Fetching fresh enrichment...");

    // 🔥 Parallel async execution
    const [context, user, transaction, external] = await Promise.all([
      contextEnrichment(),
      userEnrichment(req),
      transactionEnrichment(req),
      externalEnrichment(),
    ]);

    const enrichedData = {
      context,
      user,
      transaction,
      external,
    };

    // Cache save
    cache.set(userId, enrichedData);

    req.enrichedData = enrichedData;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = enrichmentPipeline;