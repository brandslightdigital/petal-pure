// contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCartId, addToCart as addToCartUtil } from '../src/utils/cartUtils';
import axios from 'axios';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading] = useState(false);

  const fetchCart = async () => {
    try {
      const cartId = getCartId();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart?cartId=${cartId}`);
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart", err);
    }
  };

  const addToCart = async (product) => {
    try {
      await addToCartUtil(product);
      await fetchCart(); // Refresh cart
      openCart(); // Open drawer after adding
    } catch (error) {
      console.error("Failed to add to cart:", error);
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

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateQuantity,
    removeItem,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};