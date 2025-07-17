// src/pages/TermsAndConditions.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="bg-[#fdf8f3] text-[#3b2f2f] px-4 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">📜 Terms and Conditions</h1>

        <p className="text-sm text-right italic text-gray-600">Effective Date: 10 July 2025</p>

        <ul className="list-disc list-inside space-y-3 text-[17px]">
          <li><strong>General Use:</strong> By accessing our website, you agree to comply with these terms.</li>
          <li><strong>Product Details:</strong> Prices, descriptions, and availability are subject to change without notice.</li>
          <li><strong>Orders:</strong> We reserve the right to accept or cancel orders due to availability or payment issues.</li>
          <li><strong>Intellectual Property:</strong> All content is owned by Petal Pure Oasis and may not be used without permission.</li>
          <li><strong>Limitation of Liability:</strong> We are not liable for damages resulting from use of the site or products.</li>
          <li>
            <strong>Privacy:</strong> Your data is handled according to our{' '}
            <Link to="/privacy-policy" className="underline text-[#b8865b] hover:text-[#a37445]">
              Privacy Policy
            </Link>.
          </li>
          <li><strong>Governing Law:</strong> These terms are governed by Indian law.</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsAndConditions;
