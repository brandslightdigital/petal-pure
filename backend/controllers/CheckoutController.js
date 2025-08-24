const Draft = require('../models/productDraft');
const { computeTotals } = require('../utils/Pricing');

exports.saveDetails = async (req, res) => {
  try {
    const { draftId, address, cart, cartId, directBuy } = req.body;
    if (!address || !cart?.items?.length) {
      return res.status(400).json({ success:false, message:'Missing address/cart' });
    }

    const totals = computeTotals(cart.items);

    let draft;
    if (draftId) {
      draft = await Draft.findByIdAndUpdate(
        draftId,
        {
          customer: address,
          cartItems: totals.items,
          totals: { originalPrice: totals.originalPrice, subtotal: totals.subtotal, gst: totals.gst, final: totals.final },
          cartId, directBuy, status: 'details_submitted'
        },
        { new: true }
      );
    } else {
      draft = await Draft.create({
        customer: address,
        cartItems: totals.items,
        totals: { originalPrice: totals.originalPrice, subtotal: totals.subtotal, gst: totals.gst, final: totals.final },
        cartId, directBuy
      });
    }

    res.json({ success:true, draftId: draft._id, status: draft.status });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success:false, message:'Failed to save details' });
  }
};
/**
 * GET /api/checkout/drafts
 * Query params:
 *  - page (default 1)
 *  - limit (default 20)
 *  - status: details_submitted | payment_created | payment_failed | paid | all
 *  - q: search (name, email, phone, pincode, item name)
 *  - from, to: ISO date strings (createdAt range)
 *  - includePaid: 'true' | 'false' (default false, i.e. paid ko hide)
 *  - sort: e.g. "-createdAt" (default), "createdAt", "amount"
 */
exports.listDrafts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const { status, q, from, to, includePaid, sort } = req.query;

    const where = {};

    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    } else if (includePaid !== 'true') {
      // by default, hide fully paid drafts from "Drafts" view
      where.status = { $ne: 'paid' };
    }

    // Date range
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.$gte = new Date(from);
      if (to) where.createdAt.$lte = new Date(to);
    }

    // Search query
    if (q && q.trim()) {
      const rx = new RegExp(q.trim(), 'i');
      where.$or = [
        { 'customer.fullName': rx },
        { 'customer.email': rx },
        { 'customer.phone': rx },
        { 'customer.pincode': rx },
        { 'cartItems.name': rx },
        { 'cartItems.slug': rx }
      ];
    }

    // Sorting
    let sortSpec = { createdAt: -1 };
    if (sort) {
      // e.g. -createdAt, createdAt
      const field = sort.replace(/^-/, '');
      const dir = sort.startsWith('-') ? -1 : 1;
      // Allow a couple of fields
      if (['createdAt', 'status'].includes(field)) {
        sortSpec = { [field]: dir };
      }
    }

    const [items, total] = await Promise.all([
      Draft.find(where)
        .sort(sortSpec)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Draft.countDocuments(where),
    ]);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items
    });
  } catch (err) {
    console.error('listDrafts error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch drafts' });
  }
};

/**
 * GET /api/checkout/drafts/:id
 * Get single draft detail
 */
exports.getDraft = async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id).lean();
    if (!draft) return res.status(404).json({ success: false, message: 'Draft not found' });
    res.json({ success: true, draft });
  } catch (err) {
    console.error('getDraft error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch draft' });
  }
};