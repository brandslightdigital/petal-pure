import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../assets/images/petalpurelogo.png";
import Topbar from "./Topbar";
import { getCartCount } from "../utils/cartUtils";
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0.1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const updateCartCount = async () => {
      const count = await getCartCount();
      setCartCount(count);
    };
    updateCartCount();

    // Listen to cart updates
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);
  return (
    <>
      <Topbar />

      <nav
        className={`w-full z-50 transition-all duration-300 sticky top-0 ${
          isScrolled
            ? "bg-[#1c1c1c]/90 backdrop-blur-lg shadow-md"
            : "bg-[#FAF7F3]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Petal Pure Logo" className="h-12 w-auto" />
          </Link>

          {/* Desktop Links */}
          <ul
            className={`hidden md:flex space-x-8  font-medium tracking-wide ${
              isScrolled
                ? "text-[#FAF7F3]"
                : "text-[#1c1c1c]"
            }`}
          >
            {["Home", "Shop", "Collections", "About", "Contact"].map(
              (item, index) => (
                <li key={index}>
                  <Link
                    to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    className="relative px-3 py-2 hover:text-[#C97E6D] transition-colors cursor-pointer group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E6A5A1] group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Icons */}
          <div className="flex items-center space-x-3">
            {/* Wishlist
            <button className="relative p-2 rounded-full bg-[#2a2a2a] hover:bg-[#3b3b3b] text-[#e5c79a] transition">
              <FaHeart size={16} />
              <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full font-bold">
                2
              </span>
            </button> */}

            {/* User */}
            {/* <button className="p-2 rounded-full bg-[#2a2a2a] hover:bg-[#3b3b3b] text-[#e5c79a] transition">
              <FaUser size={16} />
            </button> */}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full bg-gradient-to-r from-[#D7B98E] to-[#E6A5A1] text-black hover:scale-105 transition shadow-lg"
            >
              <FaShoppingCart size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-white text-black w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 rounded-full bg-[#2a2a2a] text-[#e5c79a]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4 bg-[#FAF7F3] border-t border-[#e5c79a33]">
            <div className="flex flex-col space-y-4 text-[#1c1c1c]">
              {["Home", "Shop", "Collections", "About", "Contact"].map(
                (item, index) => (
                  <Link
                    key={index}
                    to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    className="py-3 px-4 hover:text-[#C97E6D] transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                )
              )}

              {/* Mobile Search */}
              <div className="pt-4 border-t border-[#e5c79a40]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-[#e5c79a40] rounded-full text-[#e5c79a] placeholder-[#e5c79a99] focus:outline-none"
                  />
                  <FaSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#e5c79a]"
                    size={14}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
