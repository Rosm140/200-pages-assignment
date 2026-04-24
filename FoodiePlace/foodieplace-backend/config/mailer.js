const nodemailer = require('nodemailer');

const sendOrderEmail = async (to, order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject: `Order Confirmed - ${order.orderId}`,
      text: `Your order ${order.orderId} has been placed successfully!`,
    });

    console.log('📧 Email sent');
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = { sendOrderEmail };
