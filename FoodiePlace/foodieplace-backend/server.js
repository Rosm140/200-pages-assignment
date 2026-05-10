require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const connectDB = require('./config/db');
const { apiLimiter, orderLimiter } = require('./middleware/rateLimiter');
const orderRoutes = require('./routes/orders');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Start Server ──
const startServer = async () => {
  try {
    // Ensure DB connects before server starts
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`\n🍽️  FoodiePlace Backend running on port ${PORT}`);
      console.log(`📡 Environment : ${process.env.NODE_ENV}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('❌ Server Startup Error:', err.name, '-', err.message);
    process.exit(1);
  }
};

// ── Security ──
app.use(helmet());

// ── CORS ──
app.use(cors());
// ── Body Parser ──
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logger ──
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Global Rate Limit ──
app.use('/api/', apiLimiter);

// ── Routes ──
app.use('/api/orders', orderLimiter, orderRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: '🍽️ FoodiePlace Backend is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error.',
  });
});

startServer();
