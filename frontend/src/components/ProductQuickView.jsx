import React, { useState } from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductQuickView = ({ product, onClose }) => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

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
          <img src={product.image} alt={product.name} className="max-h-[350px] object-contain" />
        </div>

        {/* Info Section */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#3b2f2f]">{product.name}</h2>
            <p className="text-lg text-[#d33639] mt-2 mb-1">Rs. {product.price.toLocaleString()}</p>
            <p className="text-gray-700 text-sm mb-4">{product.description?.slice(0, 100)}...</p>

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
              <span className="text-sm text-green-600">✔  In stock</span>
            </div>

            {/* Quantity & Actions */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-[#3b2f2f] mb-1">Quantity</label>
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)} className="px-3 py-1 bg-gray-200 rounded text-lg">−</button>
                <span className="text-lg">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-1 bg-gray-200 rounded text-lg">+</button>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-[#d8b278] hover:bg-[#caa468] text-white py-3 rounded-md text-sm font-medium transition mb-3">
                <FaShoppingCart />
                Add to cart
              </button>
              <button className="w-full bg-black hover:bg-[#333] text-white py-3 rounded-md text-sm font-medium transition">
                Buy it now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
