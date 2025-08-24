// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import { getCartId } from "../utils/cartUtils";
import axios from "axios";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaTruck, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const cartId = getCartId();
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart?cartId=${cartId}`);
            setCart(res.data.cart);
        } catch (err) {
            console.error("Error fetching cart", err);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (slug, quantity) => {
        const cartId = getCartId();
        if (quantity <= 0) return;
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/cart/update`, {
                cartId,
                slug,
                quantity,
            });
            fetchCart();
        } catch (err) {
            console.error("Update error", err);
        }
    };

    const removeItem = async (slug) => {
        const cartId = getCartId();
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/remove/${slug}?cartId=${cartId}`);
            fetchCart();
        } catch (err) {
            console.error("Remove error", err);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);
    useEffect(() => {
        const handleStorageChange = () => {
            fetchCart(); // Refresh cart when storage changes
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading your cart...</p>
            </div>
        </div>
    );

    if (!cart || cart.items.length === 0)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-lg shadow-lg p-12 max-w-md mx-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaShoppingCart className="text-gray-400 text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );

    const calculateTotals = () => {
        let totalPrice = 0;
        let originalPrice = 0;
        cart.items.forEach((item) => {
            totalPrice += item.price * item.quantity;
            originalPrice += item.originalPrice * item.quantity;
        });

        const gstAmount = totalPrice * 0.18; // 18% GST
        const totalWithGst = totalPrice + gstAmount;

        return {
            totalPrice,
            originalPrice,
            discount: originalPrice - totalPrice,
            gstAmount,
            totalWithGst
        };
    };

    const { totalPrice, originalPrice, discount, gstAmount, totalWithGst } = calculateTotals();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Banner */}

            <div className="max-w-7xl mx-auto px-4 py-2">
                <div className="flex items-center space-x-8 py-4">
                    {/* Cart Step */}
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                            1
                        </div>
                        <span className="ml-3 text-black font-medium">Cart</span>
                    </div>

                    {/* Dotted Line */}
                    <div className="flex-1 border-t-2 border-dotted border-gray-300 w-32"></div>

                    {/* Address Step */}
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                            2
                        </div>
                        <span className="ml-3 text-gray-500">Address</span>
                    </div>

                    {/* Dotted Line */}
                    <div className="flex-1 border-t-2 border-dotted border-gray-300 w-32"></div>

                    {/* Payment Step */}
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                            3
                        </div>
                        <span className="ml-3 text-gray-500">Payment</span>
                    </div>
                </div>
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm">
                            {cart.items.map((item, i) => (
                                <div key={i} className="p-6 border-b border-gray-100 last:border-b-0">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-32 h-40 object-cover rounded-lg"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.name}</h3>
                                                    <p className="text-sm text-gray-500 mb-2">{item.description}</p>

                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl font-bold text-gray-800">₹{item.price}</span>
                                                            <span className="text-lg text-gray-400 line-through">₹{item.originalPrice}</span>
                                                            <span className="text-green-600 text-sm font-medium">
                                                                ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% Off)
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-green-600 text-sm font-medium mb-3">
                                                        You Save ₹{(item.originalPrice - item.price).toLocaleString()}
                                                    </div>


                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-3">
                                                    <select
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.slug, parseInt(e.target.value))}
                                                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {[...Array(10)].map((_, i) => (
                                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => removeItem(item.slug)}
                                                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>

                                                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                                                        <FaHeart size={14} />
                                                        <span className="text-sm">Move To Wishlist</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Price Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="font-semibold text-lg text-gray-800 mb-4">
                                PRICE DETAILS ({cart.items.length} Items)
                            </h3>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total MRP (Excl. of Taxes)</span>
                                    <span className="font-medium text-gray-800">₹{originalPrice.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between items-center text-green-600">
                                    <span>Petal Pure Discount</span>
                                    <span className="font-medium">- ₹{discount.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Shipping</span>
                                    <div className="text-right">
                                        <span className="text-gray-400 line-through text-sm">₹49</span>
                                        <span className="text-green-600 font-medium ml-2">Free</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-800">₹{totalPrice.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">GST (18%)</span>
                                    <span className="font-medium text-gray-800">₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>

                                <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                                    <span className="text-gray-600">Cart Total</span>
                                    <span className="font-medium text-gray-800">₹{totalWithGst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            <div className="border-t-2 border-gray-200 pt-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                                    <span className="text-xl font-bold text-gray-800">₹{totalWithGst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-green-600 font-medium">
                                        You Saved ₹{discount.toLocaleString()} on this order
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    localStorage.removeItem('draftId');
                                    localStorage.removeItem('draft:fp');
                                    navigate('/checkout', { state: { startFresh: true } });
                                }}
                                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
                            >
                                PLACE ORDER
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            {/* Payment Methods Section */}
            <div className="max-w-7xl mx-auto mt-2 p-6">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                    {/* SSL Security */}
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="text-white px-1 py-1 rounded text-sm font-bold">
                            <img src="/paymentimage/lock.png" className="w-30 h-15" alt="" />
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Paytm */}
                        <div className="  text-white px-3 py-1 rounded text-sm font-bold">
                            <img src="/paymentimage/paytm.png" className="w-30 h-15" alt="" />
                        </div>

                        {/* Visa */}
                        <div className="  text-white px-3 py-1 rounded text-sm font-bold">
                            <img src="/paymentimage/visa.png" className="w-30 h-15" alt="" />
                        </div>

                        {/* MasterCard */}
                        <div className="  text-white px-3 py-1 rounded text-sm font-bold">
                            <img src="/paymentimage/card.png" className="w-30 h-15" alt="" />
                        </div>

                        {/* UPI */}
                        <div className="  text-white px-3 py-1 rounded text-sm font-bold">
                            <img src="/paymentimage/upi.png" className="w-30 h-15" alt="" />
                        </div>

                        {/* Maestro */}
                        <div className="  text-white px-3 py-1 rounded text-sm font-bold">
                            <img src="/paymentimage/maestro.png" className="w-30 h-15" alt="" />
                        </div>

                        {/* RuPay */}
                        <div className="  text-white px-3 py-1 rounded text-sm font-bold">
                            <img src="/paymentimage/rupay.png" className="w-30 h-15" alt="" />
                        </div>


                        {/* Net Banking */}
                        <div className="  text-white px-3 py-1 rounded text-sm font-bold">
                            <img src="/paymentimage/net.png" className="w-30 h-15" alt="" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;