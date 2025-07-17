import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const isFormValid = () => {
    return formData.name && formData.email && formData.message;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get In Touch</h1>
          <p className="text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section – Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
              
              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800">Thank you! Your message has been sent successfully.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="sales">Sales</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-stone-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className="w-full bg-gradient-to-r from-gray-900 to-black text-white font-semibold py-4 rounded-lg transition-all duration-300 hover:from-black hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <div className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* Right Section – Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center mr-4">
                    <Phone className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-600">+91 93105 36132</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center mr-4">
                    <Mail className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-600">infot@petalspure.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center mr-4">
                    <MapPin className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Address</h4>
                    <p className="text-gray-600">H-no. 181, Ambica Vihar,</p>
                    <p className="text-gray-600"> Sunder Vihar, West Delhi 110087</p>
                    <p className="text-gray-600">India</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center mr-4">
                    <Clock className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Business Hours</h4>
                    <p className="text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sat: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sun: Closed</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Response Time */}
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <div className="text-center">
                <h4 className="font-medium text-gray-900 mb-2">Response Time</h4>
                <p className="text-sm text-gray-600">We typically respond within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How can I track my order?</h4>
              <p className="text-sm text-gray-600">You can track your order using the tracking number sent to your email after purchase.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What is your return policy?</h4>
              <p className="text-sm text-gray-600">We offer a 30-day return policy for unused items in original packaging.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Do you offer international shipping?</h4>
              <p className="text-sm text-gray-600">Currently, we only ship within India. International shipping coming soon.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How long does shipping take?</h4>
              <p className="text-sm text-gray-600">Standard shipping takes 3-5 business days, express shipping takes 1-2 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;