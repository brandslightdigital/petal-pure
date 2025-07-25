import React, { useState } from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Marquee from 'react-fast-marquee';

const Topbar = () => {
  const [showTop, setShowTop] = useState(true);

  return (
    <>
      {/* Top Red Marquee Bar */}
      {showTop && (
        <div className="bg-red-500 text-white text-sm py-2 relative overflow-hidden">
          <Marquee
            gradient={false}
            speed={50}
            pauseOnHover={true}
            className="z-10"
          >
            <span className="mx-4">Free shipping for all orders</span>
            <span className="mx-4">Limited Time Offer – Hurry Up!</span>
            <span className="mx-4">COD Available • Easy Returns</span>
          </Marquee>

          <button
            onClick={() => setShowTop(false)}
            className="absolute right-3 top-[6px] z-20 text-white bg-red-500 px-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Bottom White Bar */}
      <div className="bg-white text-black flex justify-between items-center px-4 py-2 text-sm font-medium shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <FaInstagram className="text-gray-700" />
            <span>1k Followers</span>
          </div>
        </div>

        <div>Free Shipping </div>

        <div className="flex items-center gap-1 cursor-pointer">
          <span>English</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </>
  );
};

export default Topbar;