// -------- OTP Routes --------
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// In-memory OTP store (later we will replace with Redis in Phase 8)
const otpStore = {};

// -------- SEND OTP --------
router.post("/send-otp", async (req, res) => {
  try {
    const { txnId, userId } = req.body;

    const txn = await Transaction.findOne({ txnId, userId });
    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (txn.decision !== "OTP_REQUIRED") {
      return res.status(400).json({ message: "OTP not required for this transaction" });
    }

    // Generate 6-digit OTP (simulated)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP temporarily
    otpStore[txnId] = otp;

    console.log(`Generated OTP for ${txnId}: ${otp}`);

    res.json({
      message: "OTP sent successfully (check console)",
      txnId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// -------- VERIFY OTP --------
router.post("/verify-otp", async (req, res) => {
  try {
    const { txnId, userId, otp } = req.body;

    const txn = await Transaction.findOne({ txnId, userId });
    if (!txn) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const storedOtp = otpStore[txnId];

    if (!storedOtp) {
      return res.status(400).json({ message: "OTP expired or not requested" });
    }

    if (storedOtp !== otp) {
      // Mark transaction as blocked
      txn.decision = "BLOCK";
      txn.otpVerified = false;
      await txn.save();

      return res.status(400).json({ message: "Invalid OTP — Transaction BLOCKED" });
    }

    // Correct OTP → approve transaction
    txn.decision = "ALLOW";
    txn.otpVerified = true;
    await txn.save();

    // Clear OTP
    delete otpStore[txnId];

    res.json({
      message: "OTP verified — Payment APPROVED",
      txnId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
