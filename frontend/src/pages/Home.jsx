import React from 'react';
import { FaBox, FaHeadset, FaTruck, FaArrowRight } from 'react-icons/fa';
// import heroImage from "../assets/images/petalpure.png";
import About from '../section/About';
import Categories from '../section/Categories';
import Slider from '../section/slider';
import ProductCard from '../components/ProductCard';
import Shop from '../components/Shop';
import ProductCategories from '../section/Faqs'

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero.png')", // replace with actual image path
        }}
      >
        <div className="">
          <div className="max-w-[1300px] mx-auto px-6 py-16 md:py-32 flex flex-col items-start md:items-start">
            {/* Left Text */}
            <div className="md:w-3/4">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#3B2F2F] mb-4">
                Radiant Skin <br />
                <span className="text-[#856637]">Naturally Beautiful</span>
              </h1>
              <p className="text-lg text-[#5c4a3f] mb-8 max-w-lg">
                Discover our premium skincare collection crafted with nature's finest ingredients for a glowing complexion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#D7B98E] hover:bg-[#cdb184] text-white px-8 py-3 rounded-md font-medium transition duration-300 flex items-center shadow-md">
                  Shop Now <FaArrowRight className="ml-2" />
                </button>
                <button className="border border-[#5c4a3f] text-[#5c4a3f] hover:bg-[#5c4a3f] hover:text-white px-8 py-3 rounded-md font-medium transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reversed Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 transform rotate-180"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-white"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-white"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-6 bg-[#1f1a17]">
        <div className="max-w-[1300px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#2b1b1b] p-8 rounded-lg text-center hover:shadow-xl transition duration-300 border border-[#3a2a2a]">
              <div className="flex justify-center mb-4">
                <div className="bg-[#b8865b26] p-4 rounded-full">
                  <FaTruck className="text-2xl text-[#D8B278]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#EBD3B0] mb-2">Free Worldwide Shipping</h3>
              <p className="text-[#d6bfa1]">On all orders over $50</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#2b1b1b] p-8 rounded-lg text-center hover:shadow-xl transition duration-300 border border-[#3a2a2a]">
              <div className="flex justify-center mb-4">
                <div className="bg-[#b8865b26] p-4 rounded-full">
                  <FaBox className="text-2xl text-[#D8B278]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#EBD3B0] mb-2">Eco-Friendly Packaging</h3>
              <p className="text-[#d6bfa1]">Sustainable & secure delivery</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#2b1b1b] p-8 rounded-lg text-center hover:shadow-xl transition duration-300 border border-[#3a2a2a]">
              <div className="flex justify-center mb-4">
                <div className="bg-[#b8865b26] p-4 rounded-full">
                  <FaHeadset className="text-2xl text-[#D8B278]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#EBD3B0] mb-2">24/7 Customer Support</h3>
              <p className="text-[#d6bfa1]">Dedicated skincare experts</p>
            </div>
          </div>
        </div>
      </section>



      {/* About Section */}
      <About />

      {/* Categories Section */}
      <section className="py-4 bg-[#1d0c11] ">
        <div className="container mx-auto px-6">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-serif font-bold text-[#c09d64] mb-4">Our Collections</h2>
            <div className="w-20 h-1 bg-[#c09d64] mx-auto"></div>
          </div>
          <Categories />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-2">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Best Sellers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most loved products by customers worldwide
            </p>
          </div>
          <ProductCard />
          {/* Shop Section */}
          <Shop />
        </div>
      </section>

      {/* Testimonials/Slider */}
      <Slider />
      <ProductCategories />


    </div>
  );
};

export default Home;  