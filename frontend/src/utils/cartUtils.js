import axios from 'axios';

const CART_API = `${import.meta.env.VITE_API_URL}/api/cart`; // Update if deployed

export const getCartId = () => {
  let cartId = localStorage.getItem('cartId');
  if (!cartId) {
    cartId = 'guest_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('cartId', cartId);
  }
  return cartId;
};

export const addToCart = async (product) => {
  const cartId = getCartId();

 const payload = {
  cartId,
  slug: product.slug,
  name: product.name,
    description: product.description,
  price: product.price,
  originalPrice: product.originalPrice, // ✅ include this
  image: product.image,
  quantity: product.quantity || 1,
};

  try {
    const res = await axios.post(`${CART_API}/add`, payload);
    return res.data.cart;
  } catch (err) {
    console.error("Error adding to cart:", err);
    throw err;
  }
};

export const getCartCount = async () => {
  const cartId = localStorage.getItem('cartId');
  if (!cartId) return 0;

  try {
    const res = await axios.get(`${CART_API}?cartId=${cartId}`);
    const cart = res.data.cart;
    return cart.items.reduce((acc, item) => acc + item.quantity, 0);
  } catch {
    return 0;
  }
};
