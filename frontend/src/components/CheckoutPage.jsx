import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTruck, FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getCartId } from "../utils/cartUtils";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
  });

  const fetchCart = async () => {
    try {
      const cartId = getCartId();
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart?cartId=${cartId}`
      );
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.directBuy && location.state?.product) {
      // If the user clicked 'Buy Now', use the direct product info passed via state
      setCart({ items: [location.state.product] });
      setLoading(false);
    } else {
      fetchCart();
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const calculateTotals = () => {
    if (!cart || !cart.items)
      return {
        originalPrice: 0,
        totalPrice: 0,
        discount: 0,
        gst: 0,
        finalAmount: 0,
      };

    let totalPrice = 0;
    let originalPrice = 0;

    cart.items.forEach((item) => {
      totalPrice += item.price * item.quantity;
      originalPrice += (item.originalPrice || item.price) * item.quantity;
    });

    const discount = originalPrice - totalPrice;
    const gst = totalPrice * 0.18;
    const finalAmount = totalPrice + gst;

    return { originalPrice, totalPrice, discount, gst, finalAmount };
  };

  const handlePlaceOrder = async () => {
    if (Object.values(formData).some((v) => v.trim() === "")) {
      alert("Please fill all address fields");
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay. Try again later.");
      return;
    }

    try {
      const { finalAmount } = calculateTotals();

      // Create order on your backend
      const createOrderRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          amount: Math.round(finalAmount * 100), // Convert to paise and round to integer
        }
      );

      console.log("Create Order Response:", createOrderRes.data); // Debug log

      // Verify the response structure - now checking for order.id instead of just id
      if (
        !createOrderRes.data ||
        !createOrderRes.data.order ||
        !createOrderRes.data.order.id
      ) {
        console.error("Invalid response structure:", createOrderRes.data);
        throw new Error(
          createOrderRes.data?.message ||
            "Invalid response from payment server. Missing order ID."
        );
      }

      const razorpayOrder = createOrderRes.data.order;

      const options = {
        key: "rzp_live_R5Ar1qnsR4Rqvs", // Replace with your actual test/live key
        amount: razorpayOrder.amount.toString(),
        currency: razorpayOrder.currency || "INR",
        name: "Petal Pure Oasis",
        description: `Order for ${formData.fullName}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verificationRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart: {
                  // Send proper cart structure
                  items: cart.items.map((item) => ({
                    slug: item.slug,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    originalPrice: item.originalPrice,
                  })),
                },
                address: formData, // Send complete address
              }
            );

              if (verificationRes.data?.success) {
            // Clear cart after successful payment
            try {
              await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/clear`, { cartId });
              console.log("Cart cleared successfully");
              
              // Clear local cart state
              setCart({ items: [] });
              
              // Navigate to success page
              navigate("/success", {
                state: {
                  orderId: verificationRes.data.orderId,
                  amount: finalAmount,
                  items: cart.items
                },
              });
            } catch (clearError) {
              console.error("Failed to clear cart:", clearError);
              // Still proceed to success page even if cart clearing fails
              navigate("/success", {
                state: {
                  orderId: verificationRes.data.orderId,
                  amount: finalAmount,
                  items: cart.items
                },
              });
            }
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert(`Payment verification failed: ${err.response?.data?.message || err.message}`);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Payment error:", error);
    alert(`Payment error: ${error.response?.data?.message || error.message}`);
  }
};
  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!cart || cart.items.length === 0)
    return <div className="text-center py-20">Your cart is empty</div>;

  const { originalPrice, totalPrice, discount, gst, finalAmount } =
    calculateTotals();

  return (
    <div className="min-h-screen bg-[#fffefc] px-4 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            {["fullName", "email", "phone", "pincode"].map((field, idx) => (
              <input
                key={idx}
                type={
                  field === "email"
                    ? "email"
                    : field === "phone"
                    ? "tel"
                    : "text"
                }
                name={field}
                placeholder={field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                value={formData[field]}
                onChange={handleInputChange}
                className="w-full mb-4 px-4 py-3 border rounded"
                required
              />
            ))}
            <textarea
              name="address"
              rows="3"
              placeholder="Full Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full mb-4 px-4 py-3 border rounded"
              required
            />
            <div className="flex items-center text-sm text-gray-600">
              <FaTruck className="mr-2" /> Delivery within 3–7 days across India
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Your Items</h2>
            {cart.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × ₹{item.price}
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  ₹{(item.quantity * item.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="bg-white p-6 rounded shadow space-y-3">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm">
            <span>Original Price</span>
            <span>₹{originalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>- ₹{discount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>GST (18%)</span>
            <span>
              ₹{gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>
              ₹
              {finalAmount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-black text-white py-3 mt-4 rounded hover:bg-gray-800 transition"
          >
            Place Order
          </button>
          <div className="flex items-center justify-center text-gray-600 text-sm mt-2">
            <FaLock className="mr-2" />
            100% secure payment
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
