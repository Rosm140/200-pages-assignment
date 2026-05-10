const mongoose = require('mongoose');

// ── ORDER ITEM SUB-SCHEMA ──
const orderItemSchema = new mongoose.Schema({
  itemId:   { type: Number },
  name:     { type: String, required: true, trim: true },
  price:    { type: Number, required: true, min: 0 },
  qty:      { type: Number, required: true, min: 1 },
  total:    { type: Number },
}, { _id: false });

// Auto-compute total before save
orderItemSchema.pre('validate', function () {
  this.total = this.price * this.qty;
});

// ── DELIVERY ADDRESS SUB-SCHEMA ──
const addressSchema = new mongoose.Schema({
  street:       { type: String, trim: true },
  city:         { type: String, default: 'Hyderabad', trim: true },
  state:        { type: String, default: 'Telangana', trim: true },
  pincode:      { type: String, trim: true },
  instructions: { type: String, trim: true, default: '' },
}, { _id: false });

// ── SCHEDULE SUB-SCHEMA ──
const scheduleSchema = new mongoose.Schema({
  type:      { type: String, enum: ['asap', 'later'], default: 'asap' },
  date:      { type: String, default: '' },  // YYYY-MM-DD
  timeSlot:  { type: String, default: '' },  // e.g. "7:30 PM"
}, { _id: false });

// ── MAIN ORDER SCHEMA ──
const orderSchema = new mongoose.Schema(
  {
    // Auto-generated order ID
    orderId: {
      type: String,
    },

    // ── CUSTOMER DETAILS ──
    customerName:  { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true, default: '' },

    // ── ORDER TYPE ──
    orderType: {
      type: String,
      enum: ['delivery', 'pickup'],
      required: true,
      default: 'delivery',
    },

    // ── DELIVERY ADDRESS (for delivery orders) ──
    deliveryAddress: {
      type: addressSchema,
      default: () => ({}),
    },

    // ── SCHEDULE ──
    schedule: {
      type: scheduleSchema,
      default: () => ({ type: 'asap' }),
    },

    // ── ITEMS ──
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: 'Order must have at least one item.',
      },
    },

    // ── SPECIAL REQUESTS ──
    specialRequests: {
      dietaryPreferences: [{ type: String }],  // ['No Onion', 'Gluten-Free', ...]
      kitchenNote: { type: String, trim: true, default: '' },
    },

    // ── PRICING ──
    subtotal:    { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 49 },
    tax:         { type: Number, default: 0 },
    discount:    { type: Number, default: 0 },
    couponCode:  { type: String, trim: true, uppercase: true, default: '' },
    total:       { type: Number, required: true, min: 0 },

    // ── PAYMENT ──
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'cod'],
      required: true,
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    // ── ORDER STATUS ──
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'confirmed',
    },

    // ── TRACKING ──
    statusHistory: [{
      status:    { type: String },
      timestamp: { type: Date, default: Date.now },
      note:      { type: String, default: '' },
    }],

    estimatedTime: { type: String, default: '30–45 mins' },

    // ── META ──
    ipAddress:  { type: String },
    userAgent:  { type: String },
    source:     { type: String, default: 'web' },
  },
  {
    timestamps: true,  // createdAt, updatedAt
  }
);

// ── AUTO-GENERATE orderId BEFORE SAVE ──
orderSchema.pre('save', async function (next) { // Use 'save' for both new and updates
  if (!this.orderId) {
    // For production-level reliability, a dedicated counter collection is recommended.
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = 'FP-' + String(count + 1).padStart(5, '0');
  }

  // Push initial status to history
  if (this.isNew) {
    this.statusHistory.push({ status: this.status, note: 'Order placed successfully' });
  }

  next();
});

// ── VIRTUAL: formattedDate ──
orderSchema.virtual('formattedDate').get(function () {
  return this.createdAt?.toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
});

// ── INDEX for fast lookups ──
orderSchema.index({ orderId: 1 }, { unique: true, sparse: true }); // Combine unique and sparse
orderSchema.index({ customerPhone: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
