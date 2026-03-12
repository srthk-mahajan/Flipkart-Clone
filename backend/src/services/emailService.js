import { Resend } from 'resend';

let resendClient = null;

const isNotificationsEnabled = () => String(process.env.ORDER_NOTIFICATIONS_ENABLED || 'false').toLowerCase() === 'true';

const getClient = () => {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

const buildOrderItemsHtml = (items = []) => {
  if (!items.length) return '<li>No items found</li>';

  return items
    .map((item) => {
      const lineTotal = Number(item.price) * Number(item.quantity);
      return `<li><strong>${item.name}</strong> × ${item.quantity} — ₹${Number(lineTotal).toLocaleString('en-IN')}</li>`;
    })
    .join('');
};

export const sendOrderPlacedEmail = async ({ recipientEmail, recipientName, order }) => {
  if (!isNotificationsEnabled()) {
    return { skipped: true, reason: 'ORDER_NOTIFICATIONS_ENABLED is false' };
  }

  const client = getClient();
  const fromEmail = process.env.ORDER_FROM_EMAIL;

  if (!client || !fromEmail || !recipientEmail) {
    return {
      skipped: true,
      reason: 'Missing RESEND_API_KEY, ORDER_FROM_EMAIL, or recipientEmail'
    };
  }

  const subject = `✅ Order Confirmed #${order.id}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2 style="margin-bottom: 8px;">Thanks for your order, ${recipientName || 'Customer'}!</h2>
      <p>Your order has been successfully placed.</p>

      <div style="background: #f8f8f8; border: 1px solid #eee; border-radius: 8px; padding: 12px; margin: 12px 0;">
        <p style="margin: 0 0 6px;"><strong>Order ID:</strong> #${order.id}</p>
        <p style="margin: 0 0 6px;"><strong>Status:</strong> ${order.status}</p>
        <p style="margin: 0 0 6px;"><strong>Total:</strong> ₹${Number(order.total_amount).toLocaleString('en-IN')}</p>
        <p style="margin: 0;"><strong>Shipping Address:</strong> ${order.shipping_address}</p>
      </div>

      <h3 style="margin: 12px 0 6px;">Items</h3>
      <ul style="padding-left: 18px; margin-top: 0;">
        ${buildOrderItemsHtml(order.items)}
      </ul>

      <p style="margin-top: 16px;">Happy shopping 🎉</p>
      <p style="color: #666; font-size: 12px;">This is an automated message from Flipkart Clone.</p>
    </div>
  `;

  return client.emails.send({
    from: fromEmail,
    to: [recipientEmail],
    replyTo: process.env.ORDER_REPLY_TO_EMAIL || undefined,
    subject,
    html
  });
};
