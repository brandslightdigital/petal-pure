import React, { useState, useEffect } from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext"; // Import useCart

const ProductQuickView = ({ onClose, product }) => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Use cart context

  // Optional: Add loading state if product might not be immediately available
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    if (product) {
      setLoading(false);
    }
  }, [product]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      // Use context addToCart instead of direct import
      await addToCart({
        ...product,
        quantity: qty,  // Use the selected quantity
      });
      // Cart drawer automatically open ho jayega
    } catch {
      console.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    try {
      // Use context addToCart
      await addToCart({ 
        ...product, 
        quantity: qty  // Use the selected quantity
      });

      navigate("/checkout", {
        state: {
          directBuy: true,
          product: {
            ...product,
            quantity: qty,
            originalPrice: product.originalPrice || product.price,
          },
        },
      });
    } catch {
      console.error("Failed to process Buy Now");
    }
  };

  // Show loading state if product data isn't available yet
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
        <div className="bg-white max-w-4xl w-full rounded-lg overflow-hidden flex flex-col md:flex-row relative shadow-lg p-8">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Return null if no product is provided (optional)
  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white max-w-4xl w-full rounded-lg overflow-hidden flex flex-col md:flex-row relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 z-10"
        >
          <FaTimes size={20} />
        </button>

        {/* Image Section */}
        <div className="md:w-1/2 bg-[#fdf3e5] p-8 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-[350px] object-contain" 
            onError={(e) => {
              e.target.src = '/path/to/default-image.jpg'; // Add fallback image
            }}
          />
        </div>

        {/* Info Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#3b2f2f]">{product.name}</h2>
            <p className="text-lg text-[#d33639] mt-2 mb-1">₹{product.price?.toLocaleString()}</p>
            
            {/* Show original price if available */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500 line-through text-sm">
                  ₹{product.originalPrice?.toLocaleString()}
                </span>
                <span className="text-green-600 text-sm font-medium">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            )}
            
            <p className="text-gray-700 text-sm mb-4">
              {product.description?.slice(0, 100) || 'No description available'}...
            </p>

            <button
              onClick={() => {
                navigate(`/product/${product.slug}`);
                onClose();
              }}
              className="text-sm text-[#482c04] underline hover:text-[#7a6240]"
            >
              View full details
            </button>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-green-600">✔ In stock</span>
              {product.category && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#3b2f2f] mb-2">Quantity</label>
              <div className="flex items-center gap-3 mb-4">
                <button 
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)} 
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-lg hover:bg-gray-300 transition-colors"
                  disabled={qty <= 1}
                >
                  −
                </button>
                <span className="text-lg font-semibold min-w-[30px] text-center">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)} 
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-lg hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-semibold text-lg"
                >
                  <FaShoppingCart size={18} />
                  Add to Cart ({qty})
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-3 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 font-semibold text-lg"
                >
                  Buy Now
                </button>
              </div>

              {/* Quick features */}
              <div className="mt-4 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Cash on delivery available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;