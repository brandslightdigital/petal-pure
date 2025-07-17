// src/pages/ShippingPolicy.jsx
import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="bg-[#fdf8f3] text-[#3b2f2f] px-4 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">📦 Shipping Policy</h1>

        <p className="text-sm text-right italic text-gray-600">Effective Date: 10 July 2025</p>

        {/* Section 1 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">1. Order Processing</h2>
          <p>Orders are processed within 1–3 business days.</p>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">2. Delivery Time</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Metro cities: 3–5 business days</li>
            <li>Other cities/towns: 5–7 business days</li>
            <li>Remote areas: 7–10 business days</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">3. Shipping Charges</h2>
          <p>
            Free shipping on orders above <strong>₹999</strong><br />
            ₹49 shipping fee on orders below ₹999
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">4. Tracking</h2>
          <p>Tracking details are shared via email or WhatsApp after dispatch.</p>
        </div>

        {/* Section 5 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">5. Delivery Issues</h2>
          <p>
            If your package is delayed or arrives damaged, please contact us immediately at{' '}
            <a href="mailto:info@petalpureoasis.com" className="text-[#d8b278] hover:underline">
              info@petalpureoasis.com
            </a>{' '}
            or on WhatsApp at{' '}
            <a href="https://wa.me/9310536132" className="text-[#d8b278] hover:underline">
              93105 36132
            </a>.
          </p>
        </div>

        {/* Section 6 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">6. International Shipping</h2>
          <p>Currently, we only ship within India.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
