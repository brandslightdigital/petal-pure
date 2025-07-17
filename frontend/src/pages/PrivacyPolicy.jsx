// src/pages/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#fdf8f3] text-[#3b2f2f] px-4 py-10 lg:py-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">🔒 Privacy Policy</h1>
        
        <p className="text-sm text-right italic text-gray-600">Effective Date: 10 July 2025</p>

        <p>
          At <span className="font-semibold">Petal Pure Oasis</span>, we value your privacy. This policy explains how we collect,
          use, and protect your information.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">1. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Name, email, phone number, address (when placing an order)</li>
            <li>Payment details (processed via secure third-party gateways)</li>
            <li>IP address, device info, browser data (for analytics)</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Process and deliver orders</li>
            <li>Provide customer support</li>
            <li>Improve user experience</li>
            <li>Send promotional content (only with your consent)</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">3. Sharing of Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Only with trusted third parties (payment, shipping, analytics)</li>
            <li>Never sold or rented to others</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">4. Cookies</h2>
          <p>Used to improve browsing experience and personalize content.</p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">5. Your Rights</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Request, correct, or delete your data</li>
            <li>Opt out of marketing</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">6. Contact</h2>
          <p>
            📧 <a href="mailto:info@petalpureoasis.com" className="text-[#d8b278] hover:underline">info@petalpureoasis.com</a><br />
            📱 WhatsApp: <a href="https://wa.me/919310536132" className="text-[#d8b278] hover:underline">93105 36132</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
