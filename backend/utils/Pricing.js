// utils/Pricing.js
const fs = require('fs');
const path = require('path');

let CATALOG = null;
let BY_SLUG = null;
let BY_ID = null;

function loadCatalog() {
  if (CATALOG) return CATALOG;

  const file = path.resolve(__dirname, '../data/Products.json'); // ← backend/data
  const raw = fs.readFileSync(file, 'utf8');
  const products = JSON.parse(raw);

  CATALOG = Array.isArray(products) ? products : (products?.products || []);

  BY_SLUG = new Map();
  BY_ID = new Map();

  for (const p of CATALOG) {
    if (p.slug) BY_SLUG.set(String(p.slug).trim().toLowerCase(), p);
    if (p.productId || p.id) BY_ID.set(String(p.productId || p.id), p);
  }
  return CATALOG;
}

function findProduct({ slug, productId }) {
  loadCatalog();
  if (slug) {
    const key = String(slug).trim().toLowerCase();
    if (BY_SLUG.has(key)) return BY_SLUG.get(key);
  }
  if (productId) {
    const key = String(productId);
    if (BY_ID.has(key)) return BY_ID.get(key);
  }
  // IMPORTANT: kabhi fallback nahi. Fail loud.
  throw new Error(`Product not found for slug="${slug || ''}" productId="${productId || ''}"`);
}

/**
 * itemsInput: [{ slug?, productId?, quantity }]
 * returns: { items, originalPrice, subtotal, gst, discount, final }
 */
function computeTotals(itemsInput = []) {
  if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
    return { items: [], originalPrice: 0, subtotal: 0, gst: 0, discount: 0, final: 0 };
  }

  const items = [];
  let subtotal = 0;
  let originalPrice = 0;

  for (const it of itemsInput) {
    const qty = Math.max(1, Number(it.quantity || 1));
    const prod = findProduct({ slug: it.slug, productId: it.productId }); // strict mapping

    const unitPrice = Number(prod.price);
    const unitMrp   = Number(prod.originalPrice || prod.price);

    subtotal      += unitPrice * qty;
    originalPrice += unitMrp   * qty;

    items.push({
      productId: prod.productId || prod.id || it.productId || null,
      slug: prod.slug,
      name: prod.name,
      price: unitPrice,
      originalPrice: unitMrp,
      quantity: qty,
      image: prod.image || it.image || null,
    });
  }

  const discount = Math.max(0, originalPrice - subtotal);
  const gst = +(subtotal * 0.18).toFixed(2);
  const final = +(subtotal + gst).toFixed(2);

  return { items, originalPrice, subtotal, gst, discount, final };
}

module.exports = { computeTotals };
