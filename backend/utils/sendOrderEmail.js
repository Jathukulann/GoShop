const createTransporter = require('../config/nodemailer');

const sendOrderConfirmationEmail = async (user, order) => {
  try {
    const transporter = createTransporter();

    // Format order items for email
    const orderItemsHTML = order.orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${item.name}</strong><br/>
            Size: ${item.size}${item.color ? `, Color: ${item.color}` : ''}<br/>
            Quantity: ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ₹${item.price.toFixed(2)} × ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1e3a8a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .order-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total-row { font-weight: bold; background-color: #f0f0f0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
          </div>

          <div class="content">
            <p>Dear ${user.name},</p>
            <p>Thank you for your order! We're excited to let you know that we've received your order and it's being processed.</p>

            <div class="order-info">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            </div>

            <div class="order-info">
              <h3>Order Summary</h3>
              <table>
                <thead>
                  <tr style="background-color: #f0f0f0;">
                    <th style="padding: 10px; text-align: left;">Item</th>
                    <th style="padding: 10px; text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderItemsHTML}
                  <tr>
                    <td style="padding: 10px; text-align: right;"><strong>Items Total:</strong></td>
                    <td style="padding: 10px; text-align: right;"><strong>₹${order.itemsPrice.toFixed(2)}</strong></td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; text-align: right;">Tax:</td>
                    <td style="padding: 10px; text-align: right;">₹${order.taxPrice.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; text-align: right;">Shipping:</td>
                    <td style="padding: 10px; text-align: right;">₹${order.shippingPrice.toFixed(2)}</td>
                  </tr>
                  <tr class="total-row">
                    <td style="padding: 15px; text-align: right; font-size: 18px;">Total:</td>
                    <td style="padding: 15px; text-align: right; font-size: 18px;">₹${order.totalPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="order-info">
              <h3>Shipping Address</h3>
              <p>
                ${order.shippingAddress.fullName}<br/>
                ${order.shippingAddress.address}<br/>
                ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br/>
                ${order.shippingAddress.country}<br/>
                Phone: ${order.shippingAddress.phone}
              </p>
            </div>

            <p>We'll send you another email once your order has been shipped.</p>
            <p>If you have any questions about your order, please contact our support team.</p>

            <p>Thank you for shopping with GoShop!</p>
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} GoShop. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"GoShop" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Order Confirmation - #${order._id}`,
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    // Don't fail the order if email fails
    return { success: false, error: error.message };
  }
};

module.exports = { sendOrderConfirmationEmail };
