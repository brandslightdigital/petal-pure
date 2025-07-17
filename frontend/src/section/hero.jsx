import React, { useState, useEffect } from 'react';
import banner1 from "../assets/images/petalpure.png";
import banner2 from "../assets/images/petalpure.png";
import banner3 from "../assets/images/petalpure.png";

const heroSlides = [
  {
    image: banner1,
    title: 'MAGICAL',
  },
  {
    image: banner2,
    title: 'NATURAL',
  },
  {
    image: banner3,
    title: 'GLOWING',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[60vh] overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === current ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Dots (always on top) */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              i === current ? 'bg-black' : 'border border-black bg-white'
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
