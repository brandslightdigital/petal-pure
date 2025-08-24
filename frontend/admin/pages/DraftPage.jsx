import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "details_submitted", label: "Details Submitted" },
  { value: "payment_created", label: "Payment Created" },
  { value: "payment_failed", label: "Payment Failed" },
  { value: "paid", label: "Paid (show too)" },
];

export default function DraftsPage() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("details_submitted");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const includePaid = useMemo(() => status === "paid" ? "true" : "false", [status]);
  const statusParam = useMemo(() => status === "paid" ? "all" : status, [status]);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sort: "-createdAt",
        includePaid,
      };
      if (q) params.q = q;
      if (from) params.from = from;
      if (to) params.to = to;
      if (statusParam) params.status = statusParam;

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/checkout/drafts`,
        { params }
      );

      if (data?.success) {
        setItems(data.items || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]); // status/page change pe fetch

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDrafts();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Drafts / Enquiries</h1>

      <form onSubmit={onSearch} className="bg-white p-4 rounded shadow flex flex-wrap gap-3 items-end">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="name, email, phone, pincode, item name"
            className="border rounded px-3 py-2 w-64"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">Status</label>
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="border rounded px-3 py-2"
          >
            {statusOptions.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Apply
        </button>
      </form>

      <div className="bg-white rounded shadow mt-4 overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Created</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Contact</th>
              <th className="text-left p-3">Pincode</th>
              <th className="text-left p-3">Items</th>
              <th className="text-right p-3">Amount</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-4" colSpan={8}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-4" colSpan={8}>No drafts found.</td></tr>
            ) : items.map(d => {
              const totalItems = (d.cartItems || []).reduce((s, it) => s + Number(it.quantity || 1), 0);
              const amount = d.totals?.final ?? 0;
              return (
                <tr key={d._id} className="border-t">
                  <td className="p-3">{new Date(d.createdAt).toLocaleString('en-IN')}</td>
                  <td className="p-3">{d.customer?.fullName || '-'}</td>
                  <td className="p-3">
                    <div>{d.customer?.phone || '-'}</div>
                    <div className="text-gray-500">{d.customer?.email || '-'}</div>
                  </td>
                  <td className="p-3">{d.customer?.pincode || '-'}</td>
                  <td className="p-3">{totalItems}</td>
                  <td className="p-3 text-right">₹{Number(amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100">
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/admin/dashboard/drafts/${d._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                    {/* {d.razorpay_order_id && (
                      <a
                        href={`https://dashboard.razorpay.com/app/orders/${d.razorpay_order_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-3 text-gray-600 hover:underline"
                      >
                        Razorpay
                      </a>
                    )} */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
