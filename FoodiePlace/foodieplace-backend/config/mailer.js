// Dummy mailer (no real email, just avoids crash)

const sendOrderConfirmation = async () => {
  console.log("📧 Order confirmation email skipped (dummy)");
};

const sendStatusUpdate = async () => {
  console.log("📧 Status update email skipped (dummy)");
};

module.exports = { sendOrderConfirmation, sendStatusUpdate };