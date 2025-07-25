import React, { useState, useEffect } from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from "../utils/cartUtils";

const ProductQuickView = ({ onClose, product }) => {  // Receive product as prop
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

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
      await addToCart({
        ...product,
        quantity: qty,  // Use the selected quantity
      });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      console.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    try {
      await addToCart({ 
        ...product, 
        quantity: qty  // Use the selected quantity
      });

      window.dispatchEvent(new Event("cartUpdated"));

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
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
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
            <p className="text-lg text-[#d33639] mt-2 mb-1">Rs. {product.price?.toLocaleString()}</p>
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
              View details
            </button>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-green-600">✔ In stock</span>
            </div>

            {/* Quantity & Actions */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#3b2f2f] mb-1">Quantity</label>
              <div className="flex items-center gap-3 mb-4">
                <button 
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)} 
                  className="px-3 py-1 bg-gray-200 rounded text-lg"
                >
                  −
                </button>
                <span className="text-lg">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)} 
                  className="px-3 py-1 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="cursor-pointer bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-lg w-full hover:from-black hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-bold text-lg"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="mt-2 cursor-pointer bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-8 py-4 rounded-lg w-full hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-bold text-lg"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;