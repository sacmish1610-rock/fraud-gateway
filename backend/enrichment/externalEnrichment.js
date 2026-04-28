// external enrichment
const fs = require("fs");

let cachedExternalData = null;

const externalEnrichment = async () => {
  try {
    // 🔥 Lazy loading (only load once)
    if (cachedExternalData) {
      console.log("⚡ External data from cache");
      return cachedExternalData;
    }

    console.log("📂 Loading external data from file...");

    const data = JSON.parse(
      fs.readFileSync("externalData.json", "utf-8")
    );

    cachedExternalData = data;

    return data;

  } catch (err) {
    console.error("External data error:", err.message);
    return {};
  }
};

module.exports = externalEnrichment;
// transactionenrichment