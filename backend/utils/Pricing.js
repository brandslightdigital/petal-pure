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

/** ---------- Money helpers (no floating-point drama) ---------- */
function toPaise(n) {
  // allow "1,999" strings, trim junk
  const clean = String(n ?? 0).replace(/,/g, '').trim();
  const x = Number(clean);
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100); // integer paise
}
function toRupees(paiseInt) {
  return (Number(paiseInt || 0) / 100);
}

/**
 * itemsInput: [{ slug?, productId?, quantity }]
 * returns (rupees): { items, originalPrice, subtotal, discount, final }
 */
function computeTotals(itemsInput = []) {
  if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
    return { items: [], originalPrice: 0, subtotal: 0, discount: 0, final: 0 };
  }

  const items = [];
  let subtotalP = 0;      // in paise
  let originalP = 0;      // in paise

  for (const it of itemsInput) {
    const qty = Math.max(1, Number(it.quantity || 1));
    const prod = findProduct({ slug: it.slug, productId: it.productId }); // strict mapping

    const unitPriceP = toPaise(prod.price);
    const unitMrpP   = toPaise(prod.originalPrice ?? prod.price);

    subtotalP  += unitPriceP * qty;
    originalP  += unitMrpP   * qty;

    items.push({
      productId: prod.productId || prod.id || it.productId || null,
      slug: prod.slug,
      name: prod.name,
      // Keep item fields in RUPEES for UI/back-compat, but derived from exact paise
      price: toRupees(unitPriceP),
      originalPrice: toRupees(unitMrpP),
      quantity: qty,
      image: prod.image || it.image || null,
    });
  }

  const discountP = Math.max(0, originalP - subtotalP);
  const finalP = subtotalP; // GST removed, so final == subtotal

  // Return in RUPEES to avoid touching rest of the app
  return {
    items,
    originalPrice: toRupees(originalP),
    subtotal: toRupees(subtotalP),
    discount: toRupees(discountP),
    final: toRupees(finalP),
  };
}

module.exports = { computeTotals };
