import React from "react";

const About = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Banner Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={'/banner-image.jpg'} // replace with actual image path
          alt="Petal Pure Banner"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold tracking-wide">
            About Petal Pure Oasis
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Our Story */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Story</h2>
          <p>
            Born at the intersection of Korean precision and Japanese purity,
            <strong> Petal Pure Oasis</strong> is your escape into a world of thoughtful skincare.
            Our formulations combine time-honored botanical ingredients with
            cutting-edge skin science to bring you visible results, gently.
          </p>
          <p>
            We believe skincare is not just a routine, but a ritual — one that
            connects you to yourself, your glow, and the natural world.
          </p>
        </section>

        {/* Founder Section */}
        <section className="flex flex-col md:flex-row items-center gap-8">
          <img
            src={'/images/founder.jpeg'} // replace with actual image path
            alt="Bharti kapoor"
            className="w-52 h-52 object-cover rounded-full shadow-lg"
          />
          <div>
            <h3 className="text-xl font-semibold">From Our Founder</h3>
            <p className="mt-2">
              “Every product is a promise — of purity, purpose, and performance.
              At Petal Pure Oasis, we are inspired by nature, backed by science,
              and committed to conscious beauty.”
            </p>
            <p className="mt-2 italic text-sm text-gray-500">– Bharti Ma'am</p>
          </div>
        </section>

        {/* Our Philosophy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Philosophy</h2>
          <p>
            We approach skincare with empathy — for your skin’s natural rhythm, for your busy lifestyle, and for the planet. Every ingredient is selected with care, every formula crafted with intention. Petal Pure Oasis bridges the ancient and the modern, creating products that feel luxurious and perform effectively.
          </p>
          <p>
            Our AM/PM kits are curated to simplify your regimen while deeply nourishing your skin. Whether it’s the hydration of <strong>Komenuka Rice Serum</strong> or the rejuvenation of our <strong>Bio Collagen Mask</strong>, our range caters to real skin needs with real results.
          </p>
        </section>

        {/* What We Stand For */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">What We Stand For</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <li className="bg-pink-100 p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-lg">Clean Formulations</h4>
              <p className="text-sm mt-2">
                No parabens, sulfates, or harsh chemicals — ever.
              </p>
            </li>
            <li className="bg-yellow-100 p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-lg">Ethical Beauty</h4>
              <p className="text-sm mt-2">
                Cruelty-free and eco-conscious from source to skin.
              </p>
            </li>
            <li className="bg-green-100 p-6 rounded-lg shadow-sm">
              <h4 className="font-semibold text-lg">Visible Results</h4>
              <p className="text-sm mt-2">
                Backed by science, loved by skin.
              </p>
            </li>
          </ul>
        </section>

        {/* Sustainability */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Commitment to Sustainability</h2>
          <p>
            At Petal Pure Oasis, sustainability is more than a buzzword — it’s a responsibility. We use recyclable packaging, responsibly sourced ingredients, and low-impact production processes to ensure that our footprint remains gentle on the planet.
          </p>
          <p>
            We are constantly innovating to create products that are as kind to the earth as they are to your skin.
          </p>
        </section>

        {/* Global Reach */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Our Global Reach</h2>
          <p>
            Trusted by skincare lovers in India and beyond, Petal Pure Oasis has grown into a global community. From beauty experts to first-time users, our products are embraced for their simplicity, integrity, and effectiveness.
          </p>
          <p>
            We ship worldwide and are proud to support a growing network of clean beauty advocates, influencers, and skincare enthusiasts.
          </p>
        </section>

        {/* CTA */}
        <section className="text-center mt-12">
          <h2 className="text-2xl font-semibold mb-4">Join the Petal Pure Ritual</h2>
          <p className="mb-6">
            Rediscover your skin’s natural harmony with our clean, conscious skincare.
          </p>
          <a
            href="/shop"
            className="inline-block bg-black text-white px-6 py-3 rounded-full hover:text-black hover:bg-[#FAF7F3] hover:border-1 hover:border-black transition"
          >
            Explore Our Products
          </a>
        </section>
      </div>
    </div>
  );
};

export default About;
