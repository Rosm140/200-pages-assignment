require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const connectDB = require(__dirname + '/config/db');
//const { apiLimiter, orderLimiter } = require('./middleware/rateLimiter');
const path = require('path');
const orderRoutes = require(path.join(__dirname, 'routes', 'orders'));

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect MongoDB ──
connectDB();

// ── Security ──
app.use(helmet());

// ── CORS ──
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parser ──
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logger ──
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Global Rate Limit ──
//app.use('/api/', apiLimiter);

// ── Routes ──
//app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api/orders', orderRoutes);
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

app.listen(PORT, () => {
  console.log(`\n🍽️  FoodiePlace Backend running on port ${PORT}`);
  console.log(`📡 Environment : ${process.env.NODE_ENV}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health\n`);
});
