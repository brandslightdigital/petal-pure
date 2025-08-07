import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import products from "../data/Products.json";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { addToCart } from "../utils/cartUtils";
const AccordionSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-[16px] font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <FaChevronUp className="text-gray-500 w-4 h-4" />
        ) : (
          <FaChevronDown className="text-gray-500 w-4 h-4" />
        )}
      </div>

      {isOpen && <div className="mt-3 text-sm text-gray-700">{children}</div>}
    </div>
  );
};
const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const found = products.find((p) => p.slug === slug);
    if (found) {
      setProduct(found);
      setSelectedImage(found.image);
    }
  }, [slug]);

  if (!product) {
    return (
      <p className="text-center mt-10 text-gray-600">Product not found.</p>
    );
  }
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await addToCart({
        ...product,
        quantity: 1,
      });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch {
      console.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation();
    try {
      await addToCart({ ...product, quantity: 1 });

      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/checkout", {
        state: {
          directBuy: true,
          product: {
            ...product,
            quantity: 1,
            originalPrice: product.originalPrice || product.price,
          },
        },
      });
    } catch {
      console.error("Failed to process Buy Now");
    }
  };
  const dummyRating = 4.8;
  const dummyReviewCount = 87;
  const items = [
    {
      icon: "/icons/Genuine.svg",
      title: "Genuine Product",
    },
    {
      icon: "/icons/happy-customer.svg",
      title: "Happy Customers",
    },
    {
      icon: "/icons/Make-in-india.svg",
      title: "Made in Korea & Japan",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <div className="container mx-auto py-8 px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT IMAGE SECTION */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            {/* Desktop Layout */}
            <div className="hidden lg:flex gap-6">
              {/* Thumbnail List */}
              <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
                {[product.image, product.backImage].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`thumb-${index}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 object-cover cursor-pointer border-2 transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
                      selectedImage === img
                        ? "border-yellow-600 shadow-md ring-2 ring-yellow-400 ring-opacity-50"
                        : "border-gray-300 hover:border-yellow-400"
                    }`}
                  />
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 max-w-lg">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full  object-contain bg-white shadow-xl border border-gray-200"
                />
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
              <div className="mb-6">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full object-contain bg-white shadow-xl border border-gray-200"
                />
              </div>

              <div className="flex gap-3 justify-center overflow-x-auto pb-2">
                {[product.image, product.backImage].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`thumb-${index}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 object-cover cursor-pointer border-2 transition-all duration-300 flex-shrink-0 ${
                      selectedImage === img
                        ? "border-yellow-600 shadow-md"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT DETAILS SECTION */}
          <div className="space-y-8">
            {/* Title & Rating */}
            <div className="border-b border-gray-200 pb-2 mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-semibold text-gray-900">
                    {product.rating || dummyRating}
                  </span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">
                  ({product.reviewCount || dummyReviewCount} Reviews)
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="py-1 mb-2">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-2xl font-semibold text-gray-900">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="line-through text-gray-500 text-base">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-sm bg-green-600 text-white px-3 py-1 rounded-full font-medium">
                      {product.discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>
            {/* discount */}
            <div className="bg-blue-100 text-sm rounded-md px-4 py-3 mt-4 flex items-center justify-between gap-4">
              <span className="font-medium text-gray-800">
                5% Prepaid Discount At Checkout
              </span>
              <div className="flex gap-3 items-center flex-wrap">
                <img
                  src="/icons/phonepe.png"
                  alt="PhonePe"
                  className="h-6 w-auto"
                />
                <img src="/icons/gpay.png" alt="GPay" className="h-6 w-auto" />
                <img
                  src="/icons/paytm.png"
                  alt="Paytm"
                  className="h-6 w-auto"
                />
                <img
                  src="/icons/amazon.png"
                  alt="Amazon Pay"
                  className="h-6 w-auto"
                />
                {/* <img src="/icons/citi.png" alt="Citi Bank" className="h-6 w-auto" /> */}
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 pb-3 mb-3">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="cursor-pointer bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-lg w-full hover:from-black hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-bold text-lg"
              >
                Add to Cart
              </button>
              <Link
                onClick={handleBuyNow}
                className="text-center cursor-pointer bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-8 py-4 rounded-lg w-full hover:from-amber-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-bold text-lg"
              >
                Buy Now
              </Link>
            </div>

            {/* Check section */}
            {/* Delivery Check Section */}
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-3">
                Check Delivery Date
              </h2>

              {/* Input with button */}
              <div className="flex items-center rounded-md overflow-hidden border border-gray-300">
                <input
                  type="text"
                  placeholder="Enter Your city Pincode"
                  className="w-full px-4 py-2 outline-none text-sm"
                />
                <button className="bg-black text-white font-bold px-5 py-2 text-sm">
                  Check
                </button>
              </div>

              {/* Shipping & COD Info */}
              <div className="mt-6 space-y-4">
                {/* Free Shipping */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 3h14v4h2V3a2 2 0 00-2-2H3a2 2 0 00-2 2v4h2V3zM1 9h18v8a2 2 0 01-2 2H3a2 2 0 01-2-2V9zm4 4a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  <span className="font-semibold text-gray-800">
                    Free Shipping
                  </span>
                  <svg
                    className="w-4 h-4 text-green-500 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Cash On Delivery */}
                <div className="flex items-center gap-3">
                  <div className="border border-black text-[10px] px-1.5 py-0.5 font-bold rounded-sm">
                    COD
                  </div>
                  <span className="font-semibold text-gray-800">
                    Cash On Delivery Available
                  </span>
                  <svg
                    className="w-4 h-4 text-green-500 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* Key Highlights */}
            {/* Features */}
            {/* PRODUCT DETAILS ACCORDION STYLE SECTION */}
            <div className="mt-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-2">
                Product Details
              </h2>

              {/* Specifications */}
              {product.specifications && (
                <AccordionSection title="Specifications" defaultOpen={true}>
                  <p className="text-gray-500 text-sm mb-3">
                    Technical details and features
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between pr-6">
                          <span className="font-medium text-gray-900">
                            {key}
                          </span>
                          <span className="text-gray-700">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </AccordionSection>
              )}

              {/* Description */}
              {product.description && (
                <AccordionSection title="Description">
                  <p className="text-sm leading-relaxed">
                    {product.description}
                  </p>
                </AccordionSection>
              )}

              {/* Returns Policy */}
              {product.returnPolicy && (
                <AccordionSection title="Returns, Exchange, & Refund Policy">
                  <p className="text-sm leading-relaxed">
                    {product.returnPolicy}
                  </p>
                </AccordionSection>
              )}

              {/* Marketed By */}
              {product.marketedBy && (
                <AccordionSection title="Marketed By">
                  <div className="space-y-1 text-sm">
                    {product.marketedBy.origin && (
                      <p>
                        <span className="font-medium">Country of Origin:</span>{" "}
                        {product.marketedBy.origin}
                      </p>
                    )}
                    {product.marketedBy.company && (
                      <p>
                        <span className="font-medium">Company:</span>{" "}
                        {product.marketedBy.company}
                      </p>
                    )}
                    {product.marketedBy.address && (
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {product.marketedBy.address}
                      </p>
                    )}
                    {product.marketedBy.email && (
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {product.marketedBy.email}
                      </p>
                    )}
                  </div>
                </AccordionSection>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        {product.bottomSection && (
          <div className="mt-20 pt-16 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              {product.bottomSection.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {product.bottomSection.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden rounded-2xl shadow-lg"
                >
                  <img
                    src={img}
                    alt={`Step ${idx + 1}`}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What to Expect */}
        <div className=" mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center border-t-5 border-b-5 pb-6 border-gray-200 pt-6 mt-6">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-full border border-gray-300 flex items-center justify-center">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-25 w-24 object-contain"
                />
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-900">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
