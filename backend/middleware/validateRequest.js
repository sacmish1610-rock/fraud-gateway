const validateRequest = (req, res, next) => {
  const { userId, amount, merchant } = req.body;

  if (!userId || !amount || !merchant) {
    return res.status(400).json({
      message: "userId, amount and merchant are required",
    });
  }

  next();
};

module.exports = validateRequest;