import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Truck,
  User,
  Mail,
  Phone,
  Clock,
  Calendar,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

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
            `${import.meta.env.API_URL}/api/payment/${orderId}`
          );
          setOrder(response.data.order);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    // If we have order data in location state, use that
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
    } else if (orderId) {
      // Otherwise fetch from API
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
            className="inline-block bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3 rounded-md text-sm font-semibold hover:from-black hover:to-gray-800 transition-all duration-300 shadow-md"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Format date for display
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-stone-200">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Order Confirmed!</h2>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order #{order._id} has been placed
            successfully.
          </p>

          {/* Order Status */}
          <div className="mt-4 inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4 mr-1" />
            {order.status === "completed" ? "Payment Successful" : order.status}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Order Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="font-medium">Order Date:</span> {orderDate}
              </p>
              <p>
                <span className="font-medium">Order ID:</span> {order._id}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span> ₹
                {(order.amount || 0).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Shipping Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center">
                <User className="w-4 h-4 mr-2" /> {order.customer.fullName}
              </p>
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2" /> {order.customer.email}
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2" /> +91-{order.customer.phone}
              </p>
              <p className="flex items-start">
                <Truck className="w-4 h-4 mr-2 mt-1" />
                {order.customer.address}, {order.customer.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
            Order Items
          </h3>
          <div className="space-y-4">
            {order.cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start border-b pb-4 last:border-b-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded-md border mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Qty: {item.quantity}</span>
                    <span>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Order Summary
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Original Price</span>
              <span>
                ₹
                {order.cartItems
                  .reduce(
                    (sum, item) =>
                      sum + (item.originalPrice || item.price) * item.quantity,
                    0
                  )
                  .toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                Subtotal (
                {order.cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                items)
              </span>
              <span>
                ₹
                {order.cartItems
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>
                - ₹
                {order.cartItems
                  .reduce(
                    (sum, item) =>
                      sum +
                      ((item.originalPrice || item.price) - item.price) *
                        item.quantity,
                    0
                  )
                  .toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>GST (18%)</span>
              <span>
                ₹
                {(
                  order.cartItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  ) * 0.18
                ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-medium">Total</span>
              <span className="font-semibold">
                ₹
                {(
                  order.cartItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  ) * 1.18
                ).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3 rounded-md text-sm font-semibold hover:from-black hover:to-gray-800 transition-all duration-300 shadow-md text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to={`/orders/${order._id}`} // Assuming you have an order tracking page
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
