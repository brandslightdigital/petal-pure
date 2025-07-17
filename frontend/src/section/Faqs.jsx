import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
  {
    question: "Are PetalPure products suitable for all skin types?",
    answer: "Yes, our formulations are created to suit a wide range of skin types. Each product includes clear indications for sensitive, oily, dry, or combination skin."
  },
  {
    question: "Are your products cruelty-free and vegan?",
    answer: "Absolutely! All PetalPure products are 100% cruelty-free and many are vegan. We believe in beauty without harm."
  },
  {
    question: "How long does shipping take?",
    answer: "Orders are typically delivered within 3–5 business days. Remote areas may take slightly longer, and tracking details are provided once shipped."
  },
  {
    question: "Can I return or exchange a product?",
    answer: "Yes, we have a 7-day return and exchange policy on unopened and unused items. Please check our return policy for full details."
  },
  {
    question: "Do you offer gift wrapping or custom notes?",
    answer: "Yes! At checkout, you can choose gift options including premium wrapping and personalized messages — perfect for gifting."
  }
];

const FAQsSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-4 bg-[#fdf3e5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-[#3b2f2f]">Frequently Asked Questions</h2>
          <div className="w-16 h-1 bg-[#d8b278] mx-auto mt-3 mb-4 rounded-full"></div>
          <p className="text-[#5c4a3f] max-w-3xl mx-auto">
            Have questions about our products, policies, or process? We’ve answered the most common queries below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#f0e2c8] bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center px-6 py-4 text-left text-[#3b2f2f] font-semibold focus:outline-none"
              >
                <span>{faq.question}</span>
                {activeIndex === index ? (
                  <FaChevronUp className="text-[#d8b278]" />
                ) : (
                  <FaChevronDown className="text-[#d8b278]" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4 text-[#5c4a3f] text-sm transition-all duration-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQsSection;
