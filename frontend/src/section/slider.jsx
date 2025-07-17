import React from 'react';
import { FaStar } from 'react-icons/fa';
import { SiGoogle } from 'react-icons/si';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "The night cream is magical! Woke up to visibly plumper skin after first use.",
    author: "Neha M., Hyderabad",
    stars: 5
  },
  {
    id: 2,
    quote: "My acne scars have visibly reduced after using the brightening serum for a month.",
    author: "Aarav T., Chennai",
    stars: 5
  },
  {
    id: 3,
    quote: "My skin has never looked better! The glow serum transformed my complexion in just two weeks.",
    author: "Priya K., Mumbai",
    stars: 5
  },
  {
    id: 4,
    quote: "Finally found products that don't irritate my sensitive skin. The calming cream is a lifesaver!",
    author: "Rahul S., Delhi",
    stars: 5
  }
];

const TestimonialSlider = () => {
  return (
    <section className="py-12 bg-[#fdf3e5] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-[#b8865b] mb-1">Loved By Customers</h3>
          <h2 className="text-3xl font-serif font-bold text-[#3b2f2f]">Real Results, Real Stories</h2>
          <div className="w-16 h-1 bg-[#d8b278] mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="relative">
          {/* Continuous scrolling container */}
          <motion.div
            className="flex"
            animate={{ x: ['0%', '-100%'] }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 px-4"
              >
                <div className="bg-white p-6 rounded-xl shadow-md border border-[#f0e2c8] h-full">
                  <div className="flex items-center mb-3">
                    <SiGoogle className="text-[#b8865b] mr-2 text-xl" />
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${
                            i < testimonial.stars ? 'text-[#d8b278]' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#5c4a3f] mb-4">{testimonial.quote}</p>
                  <p className="font-medium text-[#3b2f2f]">{testimonial.author}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
