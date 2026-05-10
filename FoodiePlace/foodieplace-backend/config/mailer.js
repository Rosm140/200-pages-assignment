const nodemailer = require('nodemailer');

// Transporter configuration - Ensure EMAIL_USER and EMAIL_PASS are in your .env file
const transporter = nodemailer.createTransport({
  service: 'gmail', // Consider using a professional SMTP provider for production
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a confirmation email to the customer after a successful order
 */
const sendOrderConfirmation = async (order) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"FoodiePlace" <${process.env.EMAIL_USER}>`,
    to: order.customerEmail,
    subject: `Order Confirmed - #${order.orderId}`,
    html: `
      <h1>Order Confirmed!</h1>
      <p>Hi ${order.customerName}, your order <strong>#${order.orderId}</strong> has been placed.</p>
      <p><strong>Order Type:</strong> ${order.orderType}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><strong>Estimated Time:</strong> ${order.estimatedTime}</p>
      <p>Thank you for ordering from FoodiePlace!</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Sends a status update email to the customer
 */
const sendStatusUpdate = async (update) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"FoodiePlace" <${process.env.EMAIL_USER}>`,
    to: update.email,
    subject: `Order Status Update - #${update.orderId}`,
    html: `
      <h1>Order Status Update</h1>
      <p>Hi ${update.name}, your order <strong>#${update.orderId}</strong> is now <strong>${update.status}</strong>.</p>
      <p><strong>Estimated Time:</strong> ${update.estimatedTime}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendOrderConfirmation,
  sendStatusUpdate,
};