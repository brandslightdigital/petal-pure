// components/CartDrawer.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';
import { FaTimes, FaTrash, FaShoppingCart, FaArrowRight, FaPlus, FaMinus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const calculateTotals = () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      return { totalPrice: 0, totalWithGst: 0, discount: 0, itemCount: 0 };
    }
    
    let totalPrice = 0;
    let originalPrice = 0;
    let itemCount = 0;
    
    cart.items.forEach((item) => {
      totalPrice += item.price * item.quantity;
      originalPrice += item.originalPrice * item.quantity;
      itemCount += item.quantity;
    });

    const gstAmount = totalPrice * 0.18;
    const totalWithGst = totalPrice + gstAmount;

    return {
      totalPrice,
      originalPrice,
      discount: originalPrice - totalPrice,
      gstAmount,
      totalWithGst,
      itemCount
    };
  };

  const { totalWithGst, discount, itemCount } = calculateTotals();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Shopping Cart ({itemCount})
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <FaShoppingCart className="text-gray-300 text-6xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some products to get started</p>
              <button 
                onClick={closeCart}
                className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {cart.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">₹{item.price}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-gray-500 line-through text-sm">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>

                    {item.originalPrice > item.price && (
                      <div className="text-green-600 text-xs font-medium mb-2">
                        You save ₹{(item.originalPrice - item.price) * item.quantity}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded disabled:opacity-50"
                        >
                          <FaMinus size={12} />
                        </button>
                        
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        
                        <button 
                          onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded"
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.slug)}
                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Only show if cart has items */}
        {cart && cart.items && cart.items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span>₹{totalWithGst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            
            {/* Savings */}
            {discount > 0 && (
              <div className="text-green-600 text-sm font-medium text-center">
                You save ₹{discount.toLocaleString('en-IN')} on this order
              </div>
            )}
            
            {/* Checkout Button */}
            <button 
              onClick={handleCheckout}
              className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <FaArrowRight size={16} />
            </button>
            
            {/* Continue Shopping */}
            <button 
              onClick={closeCart}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;