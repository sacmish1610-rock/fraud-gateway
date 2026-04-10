const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    txnId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    merchant: {
      type: String,
      required: true,
    },
    riskScore: {
      type: Number,
      default: 0,
    },
    decision: {
      type: String,
      enum: ["ALLOW", "OTP_REQUIRED", "BLOCK"], // 🔥 UPDATED LINE
      default: "ALLOW",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
