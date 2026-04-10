const loggerMiddleware = (req, res, next) => {
  console.log(`📡 ${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
};

module.exports = loggerMiddleware;