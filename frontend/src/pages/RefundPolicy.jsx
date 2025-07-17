// src/pages/RefundPolicy.jsx
import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="bg-[#fdf8f3] text-[#3b2f2f] px-4 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">🔁 Return & Refund Policy</h1>
        
        <p className="text-sm text-right italic text-gray-600">Effective Date: 10 July 2025</p>

        <p>
          At <span className="font-semibold">Petal Pure Oasis</span>, we want you to be fully satisfied with your purchase.
        </p>

        {/* Section 1 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">1. Return Eligibility</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Return requests must be made within 7 days of delivery</li>
            <li>Item must be unused, unopened, and in original condition</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">2. Non-Returnable Items</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Used items</li>
            <li>Sale/clearance items</li>
            <li>Customized products</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">3. How to Request a Return</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Email <a href="mailto:info@petalpureoasis.com" className="text-[#d8b278] hover:underline">info@petalpureoasis.com</a> with your order number and reason</li>
            <li>Include product photos if item is damaged</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">4. Return Shipping</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>We cover return shipping for damaged or incorrect items</li>
            <li>Customer pays return shipping if the return is for personal reasons</li>
          </ul>
        </div>

        {/* Section 5 */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">5. Refunds</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Refunds are processed within 5–7 business days after item inspection</li>
            <li>For prepaid orders: refund is made to the original payment method</li>
            <li>For COD orders: refund is processed via UPI or bank transfer</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
