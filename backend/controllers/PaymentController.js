// controllers/PaymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const Order = require('../models/Order');
const Draft = require('../models/productDraft');            // Draft/enquiry
const { computeTotals } = require('../utils/Pricing');      // server-side pricing

// Initialize Razorpay with error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
} catch (err) {
  console.error('Razorpay initialization failed:', err);
  process.exit(1);
}

/**
 * Build HTML email from server-trusted data
 */
const generateOrderConfirmationEmail = ({ order, items, customer, totals, payment, paymentMethod = 'prepaid' }) => {
  const totalItems = items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
  const subtotal = items.reduce((sum, it) => sum + Number(it.price) * (Number(it.quantity) || 1), 0);
  const savings = items.reduce((sum, it) => {
    const orig = Number(it.originalPrice ?? it.price);
    return sum + (orig - Number(it.price)) * (Number(it.quantity) || 1);
  }, 0);
  const isCOD = paymentMethod === 'cod';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Order Confirmation - Petal Pure Oasis</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f5f5f5;line-height:1.6}
        .container{max-width:600px;margin:0 auto;background:#fff;box-shadow:0 0 20px rgba(0,0,0,0.1)}
        .header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#fff;padding:30px;text-align:center}
        .header h1{font-size:28px;margin-bottom:10px}
        .content{padding:30px}
        .order-info,.price-breakdown{background:#f8f9fa;border-radius:8px;padding:20px;margin-bottom:30px}
        .order-info{border-left:4px solid #667eea}
        .order-info h3,.shipping-info h3{color:#333;margin-bottom:15px;font-size:18px}
        .info-row{display:flex;justify-content:space-between;margin-bottom:10px;padding:5px 0;border-bottom:1px solid #eee}
        .info-row:last-child{border-bottom:none}
        .info-label{font-weight:600;color:#555}.info-value{color:#333;font-weight:500}
        .items-section h3{color:#333;margin-bottom:20px;font-size:20px;border-bottom:2px solid #667eea;padding-bottom:10px}
        .item{display:flex;align-items:center;padding:15px;border:1px solid #e0e0e0;border-radius:8px;margin-bottom:15px;background:#fafafa}
        .item-image{width:60px;height:60px;border-radius:8px;margin-right:15px;object-fit:cover;border:1px solid #ddd}
        .item-details{flex:1}.item-name{font-weight:600;color:#333;margin-bottom:5px;font-size:16px}
        .item-price{color:#666;font-size:14px}.item-quantity{color:#667eea;font-weight:600;margin-left:10px}
        .item-total{font-weight:700;color:#333;font-size:16px;text-align:right;min-width:80px}
        .price-row{display:flex;justify-content:space-between;margin-bottom:10px;padding:5px 0}
        .price-row.total{border-top:2px solid #667eea;padding-top:15px;margin-top:15px;font-weight:700;font-size:18px;color:#333}
        .shipping-info{background:#e8f4f8;border-radius:8px;padding:20px;margin-bottom:30px;border-left:4px solid #17a2b8}
        .address-details{color:#555;line-height:1.8}
        .footer{background:#333;color:#fff;padding:30px;text-align:center}
        .footer h3{margin-bottom:15px;color:#667eea}
        .status-badge{display:inline-block;background:#28a745;color:#fff;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase}
        .discount-info{color:#dc3545;text-decoration:line-through;font-size:12px;margin-right:8px}
        @media(max-width:600px){
          .container{margin:0;box-shadow:none}
          .content{padding:20px}
          .item{flex-direction:column;text-align:center}
          .item-image{margin-bottom:10px}
          .info-row{flex-direction:column;text-align:center}
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌸 Petal Pure Oasis</h1>
          <p>${isCOD ? 'Your COD order has been placed.' : 'Thank you for your order! Your purchase is confirmed.'}</p>
        </div>

        <div class="content">
          <div class="order-info">
            <h3>📋 Order Details</h3>
            <div class="info-row"><span class="info-label">Order ID:</span><span class="info-value">#${order._id}</span></div>
            <div class="info-row"><span class="info-label">Payment Method:</span><span class="info-value">${isCOD ? 'Cash on Delivery' : 'Prepaid'}</span></div>
            <div class="info-row">
              <span class="info-label">Payment ID:</span>
              <span class="info-value">${!isCOD ? (order.razorpay_payment_id || '—') : '—'}</span>
            </div>
            <div class="info-row"><span class="info-label">Order Date:</span><span class="info-value">${
              new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})
            }</span></div>
            <div class="info-row"><span class="info-label">Status:</span><span class="info-value"><span class="status-badge">${order.status || (isCOD ? 'cod_placed' : 'paid')}</span></span></div>
          </div>

          <div class="items-section">
            <h3>🛍️ Your Items</h3>
            ${items.map(it => `
              <div class="item">
                <img src="${it.image || '/default-product.jpg'}" alt="${it.name}" class="item-image"/>
                <div class="item-details">
                  <div class="item-name">${it.name}</div>
                  <div class="item-price">
                    ${it.originalPrice && it.originalPrice > it.price ? `<span class="discount-info">₹${it.originalPrice}</span>` : ''}
                    ₹${it.price} <span class="item-quantity">Qty: ${it.quantity}</span>
                  </div>
                </div>
                <div class="item-total">₹${(Number(it.price) * Number(it.quantity)).toFixed(2)}</div>
              </div>
            `).join('')}
          </div>

          <div class="price-breakdown">
            <div class="price-row"><span>Subtotal (${totalItems} items):</span><span>₹${subtotal.toFixed(2)}</span></div>
            ${savings > 0 ? `<div class="price-row" style="color:#28a745;"><span>Total Savings:</span><span>-₹${savings.toFixed(2)}</span></div>` : ''}
            <div class="price-row"><span>GST (18%):</span><span>₹${Number(totals.gst).toFixed(2)}</span></div>
            <div class="price-row"><span>Shipping:</span><span>FREE</span></div>
            <div class="price-row total">
              <span>${isCOD ? 'Amount Due on Delivery:' : 'Total Paid:'}</span>
              <span>₹${(payment.amount/100).toFixed(2)}</span>
            </div>
          </div>

          <div class="shipping-info">
            <h3>🚚 Shipping Address</h3>
            <div class="address-details">
              <strong>${customer.fullName}</strong><br/>
              ${customer.address}<br/>
              PIN: ${customer.pincode}<br/>
              📞 ${customer.phone}<br/>
              ✉️ ${customer.email}
            </div>
          </div>
        </div>

        <div class="footer">
          <h3>🌟 What's Next?</h3>
          <p>${isCOD ? 'Please keep the exact amount ready at delivery.' : 'Your order will be shipped within 2-3 business days.'}</p>
          <p>You'll receive a tracking number once your order is dispatched.</p>
          <p>For any queries, contact us at support@petalpureoasis.com</p>
          <br/>
          <p>Thank you for choosing Petal Pure Oasis! 🌸</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * CREATE ORDER (server-side pricing, no client amount)
 * Input: { draftId }
 * Output: { order, draftId }
 */
exports.createOrder = async (req, res) => {
  try {
    const { draftId } = req.body;
    if (!draftId) {
      return res.status(400).json({ success: false, message: 'draftId required' });
    }

    const draft = await Draft.findById(draftId);
    if (!draft || !draft.cartItems?.length) {
      return res.status(404).json({ success: false, message: 'Draft not found or empty' });
    }

    // Always recompute from server-trusted catalog
    const totals = computeTotals(draft.cartItems);
    const amountPaise = Math.round(Number(totals.final) * 100);

    if (!Number.isFinite(amountPaise) || amountPaise < 100) {
      return res.status(400).json({ success: false, message: 'Invalid computed amount' });
    }

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1
    });

    if (!order || !order.id) throw new Error('Invalid response from Razorpay');

    draft.razorpay_order_id = order.id;
    draft.status = 'payment_created';
    await draft.save();

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        created_at: order.created_at
      },
      draftId
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

/**
 * VERIFY PAYMENT (server-trusted draft → create final Order)
 * Input: { draftId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { draftId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!draftId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification data' });
    }

    // 1) Signature verify
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      await Draft.findByIdAndUpdate(draftId, { status: 'payment_failed' });
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // 2) Fetch payment and ensure captured
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status !== 'captured') {
      await Draft.findByIdAndUpdate(draftId, { status: 'payment_failed' });
      return res.status(400).json({ success: false, message: 'Payment not captured' });
    }

    // 3) Load draft and reprice for safety
    const draft = await Draft.findById(draftId);
    if (!draft) return res.status(404).json({ success: false, message: 'Draft not found' });

    const totals = computeTotals(draft.cartItems);
    const items = totals.items;
    const amountRupees = Number(totals.final); // store rupees
    const customer = draft.customer;

    // 4) Create final Order (prepaid)
    const order = await Order.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: amountRupees,
      cartItems: items,
      customer,
      paymentMethod: 'prepaid',
      paymentStatus: 'paid',
      status: 'paid',
      totals: {
        originalPrice: totals.originalPrice,
        subtotal: totals.subtotal,
        gst: totals.gst,
        discount: totals.discount,
        final: totals.final
      }
    });

    // 5) Mark draft paid
    await Draft.findByIdAndUpdate(draftId, { status: 'paid' });

    // 6) Send confirmation email (best-effort)
    if (process.env.MAIL_USER && process.env.MAIL_PASS && customer?.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
        });

        const html = generateOrderConfirmationEmail({
          order,
          items,
          customer,
          totals,
          payment,
          paymentMethod: 'prepaid'
        });

        await transporter.sendMail({
          from: `"Petal Pure Oasis" <${process.env.MAIL_USER}>`,
          to: customer.email,
          subject: `Order Confirmation #${order._id} - Petal Pure Oasis`,
          html
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    res.json({
      success: true,
      orderId: order._id,
      paymentId: razorpay_payment_id
    });

  } catch (error) {
    console.error('Verification error:', error);
    try {
      if (req.body?.draftId) await Draft.findByIdAndUpdate(req.body.draftId, { status: 'payment_failed' });
    } catch {}
    res.status(500).json({
      success: false,
      message: error?.error?.description || 'Payment verification failed'
    });
  }
};

/**
 * PLACE COD ORDER (no gateway) — Input: { draftId } or { cart, address }
 */
exports.placeCOD = async (req, res) => {
  try {
    const { draftId, cart, address } = req.body;

    // Prefer draft, else fall back to explicit cart+address
    let customer, itemsInput;
    if (draftId) {
      const draft = await Draft.findById(draftId);
      if (!draft || !draft.cartItems?.length) {
        return res.status(404).json({ success:false, message:'Draft not found or empty' });
      }
      customer = draft.customer;
      itemsInput = draft.cartItems;
    } else {
      if (!cart?.items?.length || !address) {
        return res.status(400).json({ success:false, message:'Missing cart/address' });
      }
      customer = address;
      itemsInput = cart.items;
    }

    // Server-side pricing
    const totals = computeTotals(itemsInput);

    // Create COD order
    const order = await Order.create({
      amount: Number(totals.final),
      cartItems: totals.items,
      customer,
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      status: 'cod_placed',
      totals: {
        originalPrice: totals.originalPrice,
        subtotal: totals.subtotal,
        gst: totals.gst,
        discount: totals.discount,
        final: totals.final
      },
      razorpay_order_id: null,
      razorpay_payment_id: null,
      razorpay_signature: null
    });

    // Close draft so it disappears from "drafts" view
    if (draftId) {
      await Draft.findByIdAndUpdate(draftId, { status: 'paid' });
    }

    // Email (best-effort)
    if (process.env.MAIL_USER && process.env.MAIL_PASS && customer?.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
        });
        const fakePayment = { amount: Math.round(Number(totals.final) * 100) };
        const html = generateOrderConfirmationEmail({
          order,
          items: totals.items,
          customer,
          totals,
          payment: fakePayment,
          paymentMethod: 'cod'
        });
        await transporter.sendMail({
          from: `"Petal Pure Oasis" <${process.env.MAIL_USER}>`,
          to: customer.email,
          subject: `COD Order Placed #${order._id} - Petal Pure Oasis`,
          html
        });
      } catch (emailErr) {
        console.error('Email COD failed:', emailErr);
      }
    }

    return res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error('placeCOD error:', err);
    return res.status(500).json({ success:false, message:'Failed to place COD order' });
  }
};

// Admin list endpoints
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order details' });
  }
};
