import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FiPhone } from "react-icons/fi";
import { HiLocationMarker } from "react-icons/hi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1c1b1b] text-[#d8b278] pt-16 pb-8">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About PetalPure */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-[#d8b278]">
              PetalPure
            </h3>
            <p className="text-[#cfc5b1] mb-4">
              Crafting beauty with nature's finest ingredients since 2015. Our
              cruelty-free, sustainable products bring out your natural
              radiance.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaYoutube].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-[#d8b278]">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {/* <li><Link to="/contact" className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors">Contact Us</Link></li> */}
              <li>
                <Link to="/about-us" className="text-[#cfc5b1] hover:text-[#b8865b]  transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-[#d8b278]">
              Customer Care
            </h4>
            <ul className="space-y-2">
              {/* <li><Link to="/contact" className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors">Contact Us</Link></li> */}
              <li>
                <Link
                  to="/disclaimer"
                  className="text-red-600 transition-colors"
                >
                  ⚠️ Disclaimer
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors"
                >
                  Term & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation-policy"
                  className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-[#cfc5b1] hover:text-[#b8865b] transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium mb-4 text-[#d8b278]">
              Contact Us
            </h4>
            <div className="space-y-3 text-[#cfc5b1]">
              <div className="flex items-start">
                <HiLocationMarker className="text-[#b8865b] mt-1 mr-3 flex-shrink-0" />
                <p>
                  H-no. 181, Ambica Vihar, Sunder Vihar, West Delhi 110087,
                  India
                </p>
              </div>
              <div className="flex items-center">
                <IoMdMail className="text-[#b8865b] mr-3" />
                <a
                  href="mailto:hello@petalpure.com"
                  className="hover:text-[#d8b278]"
                >
                  info@petalspure.com
                </a>
              </div>
              <div className="flex items-center">
                <FiPhone className="text-[#b8865b] mr-3" />
                <a href="tel:+9118001234567" className="hover:text-[#d8b278]">
                  +91 93105 36132
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-sm font-medium mb-2 text-[#d8b278]">
                NEWSLETTER SIGNUP
              </h5>
              <p className="text-[#cfc5b1] text-sm mb-3">
                Get 15% off your first order plus beauty tips
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-[#2a2828] text-white px-4 py-2 text-sm rounded-l focus:outline-none focus:ring-1 focus:ring-[#d8b278] w-full"
                />
                <button className="bg-[#b8865b] hover:bg-[#c9a66b] text-white px-4 py-2 text-sm rounded-r transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Certifications */}
        <div className="border-t border-[#2e2d2d] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {["visa", "mastercard", "amex", "paypal", "upi"].map((img, i) => (
                <img
                  key={i}
                  src={`/images/${img}.png`}
                  alt={img}
                  className="h-8"
                />
              ))}
            </div>
            <div className="flex space-x-4">
              {["cruelty-free", "vegan", "organic-certified"].map((img, i) => (
                <img
                  key={i}
                  src={`/images/${img}.png`}
                  alt={img}
                  className="h-8"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#2e2d2d] pt-6 mt-6 text-center text-[#9e9b96] text-sm">
          <p>
            © {new Date().getFullYear()} PetalPure Cosmetics. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
