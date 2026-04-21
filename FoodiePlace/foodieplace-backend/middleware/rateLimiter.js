const rateLimit = require('express-rate-limit');

// Global API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  }
});

// Order-specific limiter (stricter)
const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  message: {
    success: false,
    message: 'Too many orders placed. Please wait.'
  }
});

module.exports = { apiLimiter, orderLimiter };