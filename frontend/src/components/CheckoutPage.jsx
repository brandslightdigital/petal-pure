/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTruck, FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getCartId } from "../utils/cartUtils";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// NEW: simple fingerprint for cart contents (slug/productId + qty)
const fpOf = (items = []) =>
  JSON.stringify(items.map(i => ({ id: i.slug || i.productId, q: Number(i.quantity || 1) })));

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // tiny UX sugar for Save button
  const [justSaved, setJustSaved] = useState(false);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // draft + UI states
  const [draftId, setDraftId] = useState(
    () => location.state?.resumeDraftId || localStorage.getItem("draftId") || null
  );
  const [saving, setSaving] = useState(false);
  const [paying, setPaying] = useState(false);

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
      // fresh draft for direct-buy
      localStorage.removeItem("draftId");
      setDraftId(null);

      const prod = location.state.product;
      setCart({ items: [{ ...prod, quantity: prod.quantity || 1 }] });
      setLoading(false);
    } else {
      fetchCart();
    }
  }, [location.state]);

  // NEW: if cart changes vs last-save fingerprint, reset stale draft
  useEffect(() => {
    if (!loading && cart?.items) {
      const fp = fpOf(cart.items);
      const prev = localStorage.getItem("draft:fp");
      if (prev && prev !== fp && draftId) {
        localStorage.removeItem("draftId");
        setDraftId(null);
      }
      localStorage.setItem("draft:fp", fp);
    }
  }, [loading, cart, draftId]);

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
      const qty = Number(item.quantity || 1);
      totalPrice += Number(item.price) * qty;
      originalPrice += Number(item.originalPrice || item.price) * qty;
    });

    const discount = originalPrice - totalPrice;
    const gst = totalPrice * 0.18;
    const finalAmount = totalPrice + gst;

    return { originalPrice, totalPrice, discount, gst, finalAmount };
  };

  // Basic validations
  const validateForm = () => {
    const { fullName, email, phone, pincode, address } = formData;
    if (!fullName || !email || !phone || !pincode || !address)
      return "Please fill all address fields";
    if (!/^\d{6}$/.test(pincode)) return "Pincode must be 6 digits";
    if (!/^\d{10}$/.test(phone)) return "Phone must be 10 digits";
    return null;
  };

  // STEP 1: Save details to backend and get draftId
  const saveDetails = async () => {
    const err = validateForm();
    if (err) {
      alert(err);
      return;
    }
    if (!cart?.items?.length) {
      alert("Your cart is empty");
      return;
    }

    setSaving(true);
    const started = performance.now();
    try {
      // server pricing karega; identity + qty bhejo
      const payloadItems = cart.items.map((i) => ({
        productId: i.productId,
        slug: i.slug,
        name: i.name,
        quantity: i.quantity,
        image: i.image,
      }));

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/checkout/details`,
        {
          draftId,
          address: formData,
          cart: { items: payloadItems },
          cartId: getCartId(),
          directBuy: !!location.state?.directBuy,
        }
      );

      if (res.data?.draftId) {
        setDraftId(res.data.draftId);
        localStorage.setItem("draftId", res.data.draftId);
      }

      // ensure spinner min 1s visible
      const elapsed = performance.now() - started;
      if (elapsed < 1000) await sleep(1000 - elapsed);

      // brief success feedback
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1200);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to save details");
    } finally {
      setSaving(false);
    }
  };

  // STEP 2A: Pay via Razorpay (prepaid)
  const handlePay = async () => {
    if (!draftId) {
      alert("Please save your details first");
      return;
    }

    const ok = await loadRazorpayScript();
    if (!ok) {
      alert("Failed to load Razorpay. Try again later.");
      return;
    }

    setPaying(true);
    try {
      // Server computes amount for the draft
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { draftId }
      );

      const razorpayOrder = data?.order;
      if (!razorpayOrder?.id)
        throw new Error("Invalid response from payment server. Missing order ID.");

      const cartId = getCartId();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // never hardcode
        amount: String(razorpayOrder.amount),
        currency: razorpayOrder.currency || "INR",
        name: "Petal Pure Oasis",
        description: `Order for ${formData.fullName}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: { draftId },

        handler: async function (response) {
          try {
            const verificationRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                draftId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verificationRes.data?.success) {
              // clear server cart
              try {
                await axios.post(
                  `${import.meta.env.VITE_API_URL}/api/cart/clear`,
                  { cartId }
                );
              } catch (clearError) {
                console.warn("Failed to clear cart:", clearError?.response?.data || clearError.message);
              }

              // local cleanup + broadcast
              setCart({ items: [] });
              localStorage.removeItem("draftId");
              localStorage.setItem("cart:refresh", String(Date.now()));

              const { finalAmount } = calculateTotals();
              navigate("/success", {
                state: {
                  orderId: verificationRes.data.orderId,
                  amount: finalAmount,
                  items: cart.items,
                  method: "prepaid",
                },
              });
            } else {
              navigate("/details-submitted", {
                state: { draftId, status: "payment_failed" },
              });
            }
          } catch (err) {
            console.error("Verification error:", err?.response?.data || err.message);
            navigate("/details-submitted", {
              state: { draftId, status: "payment_failed" },
            });
          }
        },

        modal: {
          ondismiss: function () {
            navigate("/details-submitted", {
              state: { draftId, status: "details_submitted" },
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment error: ${error.response?.data?.message || error.message}`);
    } finally {
      setPaying(false);
    }
  };

  // NEW STEP 2B: Cash on Delivery
  const handleCOD = async () => {
    if (!draftId) {
      alert("Please save your details first");
      return;
    }
    if (saving || paying) return;

    setPaying(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/cod`,
        { draftId }
      );

      if (data?.success) {
        const cartId = getCartId();
        // clear server cart (best-effort)
        try {
          await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/clear`, { cartId });
        } catch (e) {
          console.warn("cart clear failed (COD):", e?.response?.data || e.message);
        }

        // local cleanup + broadcast
        setCart({ items: [] });
        localStorage.removeItem("draftId");
        localStorage.setItem("cart:refresh", String(Date.now()));

        const { finalAmount } = calculateTotals();
        navigate("/success", {
          state: {
            orderId: data.orderId,
            amount: finalAmount,   // UI display only
            items: cart.items,
            method: "cod",
          },
        });
      } else {
        alert(data?.message || "COD order failed");
      }
    } catch (err) {
      console.error("COD error:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "COD order failed");
    } finally {
      setPaying(false);
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
            {draftId && (
              <div className="mt-3 text-xs text-green-700">
                Details saved. You can proceed to payment.
              </div>
            )}
            {justSaved && (
              <div className="mt-2 text-xs text-green-600">Saved ✓</div>
            )}
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

          {/* Step buttons */}
          <button
            onClick={saveDetails}
            disabled={saving}
            className="w-full bg-white border text-black py-3 mt-2 rounded hover:bg-gray-50 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : justSaved ? "Saved ✓" : "Save & Continue"}
          </button>

          {/* NEW: COD button */}
          <button
            onClick={handleCOD}
            disabled={!draftId || saving || paying}
            className="w-full bg-white border text-black py-3 mt-2 rounded hover:bg-gray-50 transition disabled:opacity-60"
          >
            Cash on Delivery
          </button>

          <button
            onClick={handlePay}
            disabled={!draftId || paying}
            className="w-full bg-black text-white py-3 mt-2 rounded disabled:opacity-60 hover:bg-gray-800 transition"
          >
            {paying ? "Processing..." : "Pay"}
          </button>
          <div className="text-xs text-center items-center justify-center text-gray-600">5% off on Prepaid</div>

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
