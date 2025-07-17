// src/pages/Disclaimer.jsx
import React from 'react';

const Disclaimer = () => {
  return (
    <div className="bg-[#fdf8f3] text-[#3b2f2f] px-4 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">⚠️ Disclaimer</h1>

        <p className="text-sm text-right italic text-gray-600">Effective Date: 10 July 2025</p>

        <ul className="list-disc list-inside space-y-3 text-[17px]">
          <li>Product colors may vary slightly due to lighting or screen settings.</li>
          <li>We do not guarantee any specific results from the use of our products.</li>
          <li>Please use all products as per the instructions provided on the label or packaging.</li>
          <li>We are not responsible for the content of third-party links or any service delays.</li>
          <li>
            Our wellness or skincare products are not intended to diagnose, treat, or cure any medical
            conditions.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Disclaimer;
