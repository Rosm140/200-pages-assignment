const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { sendOrderConfirmation, sendStatusUpdate } = require('../config/mailer');

// ─────────────────────────────────────────────────────
//  VALIDATION RULES
// ─────────────────────────────────────────────────────
const orderValidation = [
  body('customerName').trim().notEmpty().withMessage('Customer name is required'),
  body('customerPhone').trim().notEmpty().withMessage('Phone number is required')
    .matches(/^[\+]?[0-9]{10,13}$/).withMessage('Invalid phone number'),
  body('customerEmail').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('orderType').isIn(['delivery', 'pickup']).withMessage('Order type must be delivery or pickup'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.name').trim().notEmpty().withMessage('Item name is required'),
  body('items.*.price').isNumeric({ min: 0 }).withMessage('Item price must be a positive number'),
  body('items.*.qty').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
  body('subtotal').isNumeric({ min: 0 }).withMessage('Subtotal must be a positive number'),
  body('total').isNumeric({ min: 0 }).withMessage('Total must be a positive number'),
  body('paymentMethod').isIn(['upi', 'card', 'netbanking', 'cod']).withMessage('Invalid payment method'),

  // Delivery address required only for delivery orders
  body('deliveryAddress.street').if(body('orderType').equals('delivery'))
    .trim().notEmpty().withMessage('Street address is required for delivery'),
  body('deliveryAddress.pincode').if(body('orderType').equals('delivery'))
    .trim().matches(/^\d{6}$/).withMessage('Pincode must be 6 digits'),
];

// ─────────────────────────────────────────────────────
//  POST /api/orders
//  Place a new order — saves all fields to MongoDB
// ─────────────────────────────────────────────────────
router.post('/', orderValidation, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }

  const {
    customerName, customerPhone, customerEmail,
    orderType, deliveryAddress, schedule,
    items, specialRequests,
    subtotal, deliveryFee, tax, discount, couponCode, total,
    paymentMethod,
  } = req.body;

  try {
    // ── BUILD ORDER DOCUMENT ──
    const orderData = {
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      orderType,
      items: items.map(i => ({
        itemId: i.id || 0,
        name: i.name,
        price: Number(i.price),
        qty: Number(i.qty),
      })),
      specialRequests: {
        dietaryPreferences: specialRequests?.dietaryPreferences || [],
        kitchenNote: specialRequests?.kitchenNote || '',
      },
      subtotal: Number(subtotal),
      deliveryFee: (deliveryFee !== undefined && deliveryFee !== null) ? Number(deliveryFee) : (orderType === 'pickup' ? 0 : subtotal >= 500 ? 0 : 49),
      tax: (tax !== undefined && tax !== null) ? Number(tax) : Math.round(subtotal * 0.05),
      discount: (discount !== undefined && discount !== null) ? Number(discount) : 0,
      couponCode: couponCode || '',
      total: Number(total),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'confirmed',
      estimatedTime: orderType === 'pickup' ? '15 mins' : '30–45 mins',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    // ── ADD DELIVERY ADDRESS ──
    if (orderType === 'delivery') {
      orderData.deliveryAddress = {
        street: deliveryAddress.street,
        city: deliveryAddress.city || 'Hyderabad',
        state: deliveryAddress.state || 'Telangana',
        pincode: deliveryAddress.pincode,
        instructions: deliveryAddress.instructions || '',
      };
    }

    // ── ADD SCHEDULE ──
    if (schedule) {
      orderData.schedule = {
        type: schedule.type || 'asap',
        date: schedule.date || '',
        timeSlot: schedule.timeSlot || '',
      };
    }

    // ── SAVE TO MONGODB ──
    const order = await Order.create(orderData);

    // ── SEND CONFIRMATION EMAIL (non-blocking) ──
    if (order.customerEmail) {
      sendOrderConfirmation({
        orderId: order.orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderType: order.orderType,
        deliveryAddress: order.deliveryAddress || {},
        items: order.items,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        estimatedTime: order.estimatedTime,
      }).catch(err => console.error('Email failed:', err.message));
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        orderId: order.orderId,
        status: order.status,
        estimatedTime: order.estimatedTime,
        total: order.total,
        createdAt: order.createdAt,
      },
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to place order. Please try again.',
      ...(process.env.NODE_ENV === 'development' && { error: error.message }),
    });
  }
});

// ─────────────────────────────────────────────────────
//  GET /api/orders
//  Get all orders (admin) with filtering & pagination
// ─────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { status, orderType, page = 1, limit = 20, phone, from, to } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;
    if (phone) filter.customerPhone = { $regex: phone, $options: 'i' };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to + 'T23:59:59');
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments(filter),
    ]);

    // Stats
    const stats = await Order.aggregate([
      { $match: filter },
      { $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        avgOrderValue: { $avg: '$total' },
        totalOrders: { $sum: 1 },
      }},
    ]);

    return res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      stats: stats[0] || { totalRevenue: 0, avgOrderValue: 0, totalOrders: 0 },
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────
//  GET /api/orders/:orderId
//  Get single order by orderId (for tracking page)
// ─────────────────────────────────────────────────────
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() }).lean();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    return res.json({ success: true, data: order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────
//  PATCH /api/orders/:orderId/status
//  Update order status (admin / kitchen)
// ─────────────────────────────────────────────────────
router.patch('/:orderId/status', [
  body('status').isIn(['pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled'])
    .withMessage('Invalid status value'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { status, note } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.status = status;
    order.statusHistory.push({ status, note: note || '', timestamp: new Date() });

    // Update estimated time based on status
    const timeMap = {
      confirmed: '30–45 mins', preparing: '20–30 mins',
      ready: '5–10 mins', out_for_delivery: '10–20 mins',
      delivered: 'Delivered', cancelled: 'Cancelled',
    };
    if (timeMap[status]) order.estimatedTime = timeMap[status];

    await order.save();

    // Send status email (non-blocking)
    if (order.customerEmail) {
      sendStatusUpdate({
        email: order.customerEmail,
        name: order.customerName,
        orderId: order.orderId,
        status,
        estimatedTime: order.estimatedTime,
      }).catch(err => console.error('Status email failed:', err.message));
    }

    return res.json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: { orderId: order.orderId, status: order.status, estimatedTime: order.estimatedTime },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────
//  DELETE /api/orders/:orderId
//  Cancel / delete order
// ─────────────────────────────────────────────────────
router.delete('/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Only allow cancellation of pending/confirmed orders
    if (['out_for_delivery', 'delivered'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel an order that is already out for delivery or delivered.' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by user', timestamp: new Date() });
    await order.save();

    return res.json({ success: true, message: 'Order cancelled successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────
//  GET /api/orders/phone/:phone
//  Get orders by customer phone (for order history)
// ─────────────────────────────────────────────────────
router.get('/phone/:phone', async (req, res) => {
  try {
    const orders = await Order.find({ customerPhone: req.params.phone })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.json({ success: true, total: orders.length, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
