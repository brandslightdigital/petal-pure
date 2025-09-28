/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function DraftDetail() {
  const { id } = useParams();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/checkout/drafts/${id}`);
      if (data?.success) setDraft(data.draft);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to load draft");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!draft) return <div className="p-6">Not found</div>;

  const totalItems = (draft.cartItems || []).reduce((s, it) => s + Number(it.quantity || 1), 0);

  const fmt = (n) => Number(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
  const totals = draft.totals || {};
  const showDiscount = Number(totals.discount ?? (totals.originalPrice - totals.subtotal)) > 0;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Draft #{draft._id}</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Items ({totalItems})</h2>
          <div className="divide-y">
            {(draft.cartItems || []).map((it, idx) => {
              const qty = Number(it.quantity || 1);
              const price = Number(it.price || 0);
              const mrp = Number(it.originalPrice ?? it.price ?? 0);
              const hasDiscount = mrp > price;
              return (
                <div key={idx} className="py-3 flex items-center gap-4">
                  <img
                    src={it.image || "/default-product.jpg"}
                    alt={it.name}
                    className="w-16 h-16 object-cover rounded border"
                    onError={(e) => { e.currentTarget.src = "/default-product.jpg"; }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-600">Qty: {qty}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {hasDiscount && (
                        <span className="text-xs text-gray-500 line-through">₹{fmt(mrp)}</span>
                      )}
                      <span>₹{fmt(price)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Total: ₹{fmt(price * qty)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-3">Customer</h2>
          <div className="text-sm">
            <div>{draft.customer?.fullName}</div>
            <div>{draft.customer?.email}</div>
            <div>{draft.customer?.phone}</div>
            <div>{draft.customer?.address}</div>
            <div>PIN: {draft.customer?.pincode}</div>
          </div>

          <h2 className="font-semibold mt-4 mb-2">Summary</h2>
          <div className="text-sm space-y-1">
            {totals.originalPrice != null && (
              <div className="flex justify-between">
                <span>MRP Total</span>
                <span>₹{fmt(totals.originalPrice)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{fmt(totals.subtotal)}</span>
            </div>
            {showDiscount && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-₹{fmt(totals.discount ?? (totals.originalPrice - totals.subtotal))}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-1 border-t">
              <span>Final</span>
              <span>₹{fmt(totals.final)}</span>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <div>Status: <span className="px-2 py-1 bg-gray-100 rounded">{draft.status}</span></div>
            <div className="text-gray-500 mt-1">Created: {new Date(draft.createdAt).toLocaleString('en-IN')}</div>
          </div>

          {draft.razorpay_order_id && (
            <a
              href={`https://dashboard.razorpay.com/app/orders/${draft.razorpay_order_id}`}
              className="inline-block mt-4 text-blue-600 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              View in Razorpay
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
