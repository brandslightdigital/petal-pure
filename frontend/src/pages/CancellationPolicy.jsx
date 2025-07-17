// src/pages/CancellationPolicy.jsx
import React from 'react';

const CancellationPolicy = () => {
  return (
    <div className="bg-[#fdf8f3] text-[#3b2f2f] px-4 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">❌ Cancellation Policy</h1>

        <p className="text-sm text-right italic text-gray-600">Effective Date: 10 July 2025</p>

        {/* Section 1 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">1. Cancellation Window</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Orders can be cancelled within 12 hours of placing</li>
            <li>Orders cannot be cancelled once shipped</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">2. How to Cancel</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Email us at <a href="mailto:info@petalpureoasis.com" className="text-[#d8b278] hover:underline">info@petalpureoasis.com</a>
            </li>
            <li>
              Or WhatsApp us at <a href="https://wa.me/9310536132" className="text-[#d8b278] hover:underline">93105 36132</a> with your order number
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">3. Refund for Cancelled Orders</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Full refund for cancellations made before shipping</li>
            <li>Refund processed within 5–7 business days</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">4. We May Cancel Orders If:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Product is out of stock</li>
            <li>Issues with address or payment</li>
            <li>Suspicious or fraudulent activity is detected</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
