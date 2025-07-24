import React, { useState } from 'react';
import { 
  FaGlobe,
  FaLeaf,
  FaHeartbeat,
  FaTimesCircle,
  FaCommentDots,
} from 'react-icons/fa';
import imagetwo from "../assets/images/aboutimage.png"
import { Link } from 'react-router-dom';

const About = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-orange-50 py-8">
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black opacity-5 pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>
      
      <div className="relative max-w-[1300px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-2">
        
        {/* Text Column */}
        <div className="flex-1 space-y-6 lg:space-y-8 text-left">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-1 mb-0 ">
            <span className="text-sm uppercase tracking-wider text-gray-500 font-medium">
              Pure & Effective
            </span>
            <div className="w-8 h-px bg-gradient-to-r from-pink-400 to-transparent"></div>
          </div>
          
          {/* Main Heading */}
          <h2 className="text-2xl md:text-5xl font-extrabold text-gray-900 leading-tight  mb-2">
            Deeply Nourishing Face Serum
            <br />
            <span className="text-[#472d1c]">For Glowing & Healthy Skin</span>
          </h2>
          
          {/* Description */}
          <p className="text-base md:text-lg text-gray-700 max-w-2xl leading-relaxed  mb-0">
            Fortified with botanical actives and powerful antioxidants, our face serum penetrates deeply to repair, hydrate, and protect—leaving your skin radiantly youthful.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl pt-2 mb-2">
            {[
              { icon: <FaGlobe/>, label: 'Global Organic Extracts' },
              { icon: <FaHeartbeat/>, label: 'Revitalizes Skin Barrier' },
              { icon: <FaLeaf/>, label: '100% Vegan & Cruelty-Free' },
              { icon: <FaTimesCircle/>, label: 'Paraben & Sulfate-Free' },
            ].map((feat, i) => (
              <div 
                key={i} 
                className="group flex items-center space-x-4 p-1 md:p-3 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`p-3 bg-white rounded-full shadow-md ring-2 ring-[#1d0c11] transition-all duration-300 ${hoveredFeature === i ? 'scale-110 ring-[#c09d64]' : ''}`}>
                  {React.cloneElement(feat.icon, { 
                    className: `text-xl transition-colors duration-300 ${hoveredFeature === i ? 'text-[#c09d64]' : 'text-[#1d0c11]'}` 
                  })}
                </div>
                <span className="font-medium text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {feat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="pt-2">
            <Link to="/about" className="bg-gradient-to-r from-[#c09d64] to-[#1d0c11] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
              Learn More About Our Ingredients
            </Link>
          </div>
        </div>

        {/* Image Column */}
        <div className="flex-1 flex justify-center lg:justify-center">
          <div className="relative">
            <img
              src={imagetwo}
              alt="Face Serum Jar"
              className="w-80 md:w-96 transform rotate-3 hover:rotate-1 transition-transform duration-500 drop-shadow-2xl"
            />
            
            {/* Floating badge */}
            <div className="absolute -top-4 -left-4 bg-gradient-to-r from-[#35302c] to-[#5e412e] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
              100% Natural
            </div>
            
            {/* Floating review */}
            <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-lg shadow-xl border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
                <span className="text-sm text-gray-600">4.9/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;