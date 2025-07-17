// utils/cartId.js
export const getCartId = () => {
  let cartId = localStorage.getItem("cartId");
  if (!cartId) {
    cartId = "guest_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("cartId", cartId);
  }
  return cartId;
};
