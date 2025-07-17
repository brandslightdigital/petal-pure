const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// Initialize Razorpay with error handling
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
} catch (err) {
  console.error('Razorpay initialization failed:', err);
  process.exit(1); // Exit if Razorpay can't be initialized
}

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount < 100) { // Minimum amount is 100 paise (₹1)
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount. Minimum amount is ₹1' 
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount), // Ensure integer value
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    });

    // Validate Razorpay response
    if (!order || !order.id) {
      throw new Error('Invalid response from Razorpay');
    }

    res.status(200).json({ 
      success: true, 
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        created_at: order.created_at
      } 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const generateOrderConfirmationEmail = (order, cart, address, payment) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Petal Pure Oasis</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                line-height: 1.6;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 30px;
            }
            
            .order-info {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
                border-left: 4px solid #667eea;
            }
            
            .order-info h3 {
                color: #333;
                margin-bottom: 15px;
                font-size: 18px;
            }
            
            .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 5px 0;
                border-bottom: 1px solid #eee;
            }
            
            .info-row:last-child {
                border-bottom: none;
            }
            
            .info-label {
                font-weight: 600;
                color: #555;
            }
            
            .info-value {
                color: #333;
                font-weight: 500;
            }
            
            .items-section {
                margin-bottom: 30px;
            }
            
            .items-section h3 {
                color: #333;
                margin-bottom: 20px;
                font-size: 20px;
                border-bottom: 2px solid #667eea;
                padding-bottom: 10px;
            }
            
            .item {
                display: flex;
                align-items: center;
                padding: 15px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                margin-bottom: 15px;
                background: #fafafa;
            }
            
            .item-image {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                margin-right: 15px;
                object-fit: cover;
                border: 1px solid #ddd;
            }
            
            .item-details {
                flex: 1;
            }
            
            .item-name {
                font-weight: 600;
                color: #333;
                margin-bottom: 5px;
                font-size: 16px;
            }
            
            .item-price {
                color: #666;
                font-size: 14px;
            }
            
            .item-quantity {
                color: #667eea;
                font-weight: 600;
                margin-left: 10px;
            }
            
            .item-total {
                font-weight: 700;
                color: #333;
                font-size: 16px;
                text-align: right;
                min-width: 80px;
            }
            
            .price-breakdown {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
            }
            
            .price-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 5px 0;
            }
            
            .price-row.total {
                border-top: 2px solid #667eea;
                padding-top: 15px;
                margin-top: 15px;
                font-weight: 700;
                font-size: 18px;
                color: #333;
            }
            
            .shipping-info {
                background: #e8f4f8;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
                border-left: 4px solid #17a2b8;
            }
            
            .shipping-info h3 {
                color: #333;
                margin-bottom: 15px;
                font-size: 18px;
            }
            
            .address-details {
                color: #555;
                line-height: 1.8;
            }
            
            .footer {
                background: #333;
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .footer h3 {
                margin-bottom: 15px;
                color: #667eea;
            }
            
            .footer p {
                margin-bottom: 10px;
                opacity: 0.9;
            }
            
            .status-badge {
                display: inline-block;
                background: #28a745;
                color: white;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
            }
            
            .discount-info {
                color: #dc3545;
                text-decoration: line-through;
                font-size: 12px;
                margin-right: 8px;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 0;
                    box-shadow: none;
                }
                
                .content {
                    padding: 20px;
                }
                
                .item {
                    flex-direction: column;
                    text-align: center;
                }
                
                .item-image {
                    margin-bottom: 10px;
                }
                
                .info-row {
                    flex-direction: column;
                    text-align: center;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Header -->
            <div class="header">
                <h1>🌸 Petal Pure Oasis</h1>
                <p>Thank you for your order! Your purchase is confirmed.</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <!-- Order Information -->
                <div class="order-info">
                    <h3>📋 Order Details</h3>
                    <div class="info-row">
                        <span class="info-label">Order ID:</span>
                        <span class="info-value">#${order._id}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Payment ID:</span>
                        <span class="info-value">${order.razorpay_payment_id}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Order Date:</span>
                        <span class="info-value">${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value">
                            <span class="status-badge">${order.status || 'Confirmed'}</span>
                        </span>
                    </div>
                </div>
                
                <!-- Items Section -->
                <div class="items-section">
                    <h3>🛍️ Your Items</h3>
                    ${cart.items.map(item => `
                        <div class="item">
                            <img src="${item.image || '/default-product.jpg'}" alt="${item.name}" class="item-image">
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-price">
                                    ${item.originalPrice && item.originalPrice > item.price ? 
                                        `<span class="discount-info">₹${item.originalPrice}</span>` : ''
                                    }
                                    ₹${item.price}
                                    <span class="item-quantity">Qty: ${item.quantity}</span>
                                </div>
                            </div>
                            <div class="item-total">
                                ₹${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Price Breakdown -->
                <div class="price-breakdown">
                    <div class="price-row">
                        <span>Subtotal (${cart.items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                        <span>₹${cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                    </div>
                    ${cart.items.some(item => item.originalPrice && item.originalPrice > item.price) ? `
                        <div class="price-row" style="color: #28a745;">
                            <span>Total Savings:</span>
                            <span>-₹${cart.items.reduce((sum, item) => 
                                sum + ((item.originalPrice || item.price) - item.price) * item.quantity, 0
                            ).toFixed(2)}</span>
                        </div>
                    ` : ''}
                    <div class="price-row">
                        <span>Shipping:</span>
                        <span>FREE</span>
                    </div>
                    <div class="price-row total">
                        <span>Total Paid:</span>
                        <span>₹${(payment.amount/100).toFixed(2)}</span>
                    </div>
                </div>
                
                <!-- Shipping Information -->
                <div class="shipping-info">
                    <h3>🚚 Shipping Address</h3>
                    <div class="address-details">
                        <strong>${address.fullName}</strong><br>
                        ${address.address}<br>
                        PIN: ${address.pincode}<br>
                        📞 ${address.phone}<br>
                        ✉️ ${address.email}
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <h3>🌟 What's Next?</h3>
                <p>Your order is being processed and will be shipped within 2-3 business days.</p>
                <p>You'll receive a tracking number once your order is dispatched.</p>
                <p>For any queries, contact us at support@petalpureoasis.com</p>
                <br>
                <p>Thank you for choosing Petal Pure Oasis! 🌸</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Updated verifyPayment function with enhanced email
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      cart,
      address
    } = req.body;

    // 1. Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // 2. Verify payment
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status !== 'captured') {
      return res.status(400).json({ success: false, message: 'Payment not captured' });
    }

    // 3. Save to database
    const order = await Order.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: payment.amount / 100,
      cartItems: cart.items.map(item => ({
        slug: item.slug,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        originalPrice: item.originalPrice
      })),
      customer: {
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        address: address.address,
        pincode: address.pincode
      },
      status: 'completed',
      createdAt: new Date()
    });

    // 4. Send enhanced confirmation email
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });

        const mailOptions = {
          from: `"Petal Pure Oasis" <${process.env.MAIL_USER}>`,
          to: address.email,
          subject: `Order Confirmation #${order._id} - Petal Pure Oasis`,
          html: generateOrderConfirmationEmail(order, cart, address, payment),
        };

        await transporter.sendMail(mailOptions);
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
    res.status(500).json({ 
      success: false,
      message: error.error?.description || 'Payment verification failed'
    });
  }
};
exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
};