import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Truck,
  User,
  Mail,
  Phone,
  Clock,
  Calendar,
  IndianRupee,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const fmt = (n) =>
  Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

const SuccessPage = () => {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // If coming directly with state (from checkout)
  const { orderId } = location.state || {};

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (orderId) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/payment/${orderId}`
          );
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
    } else if (orderId) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderId, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-stone-200 text-center">
          <p>Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-stone-200 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't retrieve your order details. Please check your email for
            confirmation or contact support.
          </p>
          <Link
            to="/"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-black transition-all duration-300 shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Prefer server totals, fallback to client computation
  const totals = order.totals || {};
  const computedOriginal = order.cartItems?.reduce(
    (s, it) => s + ((it.originalPrice ?? it.price) * it.quantity),
    0
  ) || 0;
  const computedSubtotal = order.cartItems?.reduce(
    (s, it) => s + (it.price * it.quantity),
    0
  ) || 0;

  const originalPrice = totals.originalPrice ?? computedOriginal;
  const subtotal = totals.subtotal ?? computedSubtotal;
  const discount =
    totals.discount ??
    Math.max(0, Number(originalPrice) - Number(subtotal));
  const final =
    totals.final ?? order.amount ?? subtotal; // your backend stores rupees in `amount`

  const itemCount = order.cartItems?.reduce((s, it) => s + it.quantity, 0) || 0;

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isCOD = (order.paymentMethod || "").toLowerCase() === "cod";
  const paid = (order.paymentStatus || "").toLowerCase() === "paid";

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-stone-200">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Order Confirmed</h2>
          <p className="text-gray-600 mt-2">
            Thanks for your purchase. Order <span className="font-semibold">#{order._id}</span> has been placed successfully.
          </p>

          {/* Status badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              <PackageCheck className="w-4 h-4 mr-1" />
              {String(order.status || "").replace("_", " ")}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${paid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              <Clock className="w-4 h-4 mr-1" />
              {paid ? "Payment Received" : isCOD ? "COD - Pay on Delivery" : "Unpaid"}
            </span>
            <span className="inline-flex items-center bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-medium">
              <CreditCard className="w-4 h-4 mr-1" />
              {(order.paymentMethod || "prepaid").toUpperCase()}
            </span>
          </div>
        </div>

        {/* Order + Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl border p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Order Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="font-medium mr-1">Order Date:</span> {orderDate}
              </p>
              <p className="truncate">
                <span className="font-medium">Order ID:</span> {order._id}
              </p>
              <p className="flex items-center">
                <IndianRupee className="w-4 h-4 mr-2" />
                <span className="font-medium mr-1">{isCOD ? "Amount Due:" : "Total Paid:"}</span>
                ₹{fmt(final)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Shipping Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center">
                <User className="w-4 h-4 mr-2" /> {order.customer.fullName}
              </p>
              {order.customer.email && (
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" /> {order.customer.email}
                </p>
              )}
              {order.customer.phone && (
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> +91-{order.customer.phone}
                </p>
              )}
              <p className="flex items-start">
                <Truck className="w-4 h-4 mr-2 mt-1" />
                <span>
                  {order.customer.address}
                  {order.customer.pincode ? `, ${order.customer.pincode}` : ""}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Order Items
          </h3>
          <div className="space-y-4">
            {order.cartItems.map((item, index) => {
              const mrp = Number(item.originalPrice ?? item.price);
              const price = Number(item.price || 0);
              const hasDiscount = mrp > price;
              return (
                <div
                  key={index}
                  className="flex items-start border rounded-lg p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-md border mr-4 bg-white"
                    onError={(e) => { e.currentTarget.src = "/default-product.jpg"; }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900 pr-4">{item.name}</h4>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          {hasDiscount && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{fmt(mrp)}
                            </span>
                          )}
                          <span className="font-medium">₹{fmt(price)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Total: ₹{fmt(price * item.quantity)}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</div>
                    {hasDiscount && (
                      <div className="text-xs text-green-600 mt-1">
                        You save ₹{fmt((mrp - price) * item.quantity)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary (GST removed) */}
        <div className="bg-gray-50 p-4 rounded-xl border">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>MRP Total</span>
              <span>₹{fmt(originalPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span>
                Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
              <span>₹{fmt(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{fmt(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-emerald-700 font-medium">FREE</span>
            </div>

            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-medium">{isCOD ? "Amount Due" : "Total"}</span>
              <span className="font-semibold">₹{fmt(final)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            to="/"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-black transition-all duration-300 shadow-md text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to={`/orders/${order._id}`}
            className="inline-block border border-gray-900 text-gray-900 px-6 py-3 rounded-md text-sm font-semibold hover:bg-gray-100 transition-all duration-300 text-center"
          >
            Track Your Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
