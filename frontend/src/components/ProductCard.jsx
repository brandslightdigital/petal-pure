import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaEye, FaHeart } from "react-icons/fa";
import ProductQuickView from "./ProductQuickView";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // Manage the loading state
  // eslint-disable-next-line no-unused-vars
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const { addToCart: addItemToCart, openCartDrawer } = useCart(); // Destructure the addToCart and openCartDrawer function

  if (!product) return null;

  const handleClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAddingToCart(true); // Set loading state for adding to cart
    try {
      await addItemToCart(product); // This will handle adding and opening drawer
      openCartDrawer(); // Trigger the drawer to open when an item is added
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false); // Reset the loading state
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    setIsBuyingNow(true);
    try {
      await addItemToCart({ ...product, quantity: 1 });
      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/checkout", {
        state: {
          directBuy: true,
          product: {
            ...product,
            quantity: 1,
            originalPrice: product.originalPrice || product.price,
          },
        },
      });
    } catch (error) {
      console.error("Failed to process Buy Now:", error);
    } finally {
      setIsBuyingNow(false);
    }
  };

  const getDiscountPercent = (originalPrice, price) => {
    if (!originalPrice || !price) return null;
    const discount = ((originalPrice - price) / originalPrice) * 100;
    return Math.round(discount);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full group relative"
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-[#f6eadc] flex items-center justify-center p-1 overflow-hidden">
          {/* Main Image - Fades out on hover */}
          <div className="absolute inset-0 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-105">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
              loading="lazy" // Add lazy loading
            />
          </div>

          {/* Hover Image - Fades in on hover */}
          {product.hoverImage && (
            <div className="absolute inset-0 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105">
              <img
                src={product.hoverImage}
                alt={product.name}
                className="w-full h-full object-contain"
                loading="lazy" // Add lazy loading
              />
            </div>
          )}

          {/* Eye Icon - Quick View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickView(true);
            }}
            className="absolute top-2 right-2 bg-white p-2 rounded-full text-[#3b2f2f] shadow hover:text-white hover:bg-[#3b2f2f] transition opacity-0 group-hover:opacity-100 z-10"
            aria-label="Quick view"
          >
            <FaEye size={16} />
          </button>

          {/* Sale badge */}
          {product.onSale && (
            <div className="absolute top-3 left-3 bg-[#b8865b] text-white text-xs font-semibold px-2 py-1 rounded-full shadow z-10">
              SALE
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-grow mt-5">
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>

          <span className="text-xs text-[#b8865b] uppercase tracking-wide mb-1">
            {product.category}
          </span>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-semibold text-[#000000]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              {/* Discount Badge */}
              <span className="ml-2 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded">
                {getDiscountPercent(product.originalPrice, product.price)}% OFF
              </span>
            </div>

            {/* <div className="grid grid-cols-1 gap-1">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`flex items-center justify-center gap-2 border-1 border-[#000000] text-[#fdfdfd] bg-black hover:bg-transparent hover:text-black py-2 px-3 text-sm font-medium transition-all cursor-pointer ${
                  isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <FaShoppingCart size={14} />
                <span>{isAddingToCart ? "Adding..." : "Add To Cart"}</span>
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <ProductQuickView
          product={product}
          onClose={() => setShowQuickView(false)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </>
  );
};

export default ProductCard;
