import React from "react";

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 font-sans">
      {/* Page Title */}
      <div className="mt-14">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 underline">
        Shipping Information
      </h1>
      </div>

      {/* Intro */}
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        At <span className="font-semibold">Kulangara</span>, we strive to
        deliver your favorite clothing quickly and safely. Here’s everything you
        need to know about our shipping policies and timelines.
      </p>

      {/* Shipping Policy */}
      <div className="space-y-10">
        {/* Delivery Times */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Delivery Times</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Domestic (India): 3–5 business days after dispatch</li>
            <li>International: 7–14 business days depending on location</li>
            <li>
              Orders placed on weekends or holidays will be processed on the
              next working day.
            </li>
          </ul>
        </section>

        {/* Shipping Charges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Charges</h2>
          <p className="text-gray-700 mb-3">
            We aim to keep shipping affordable for everyone:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Free shipping on orders above ₹999 (India only)</li>
            <li>
              Flat rate shipping of ₹99 for orders below ₹999 (India only)
            </li>
            <li>
              International shipping rates are calculated at checkout based on
              destination.
            </li>
          </ul>
        </section>

        {/* Order Tracking */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
          <p className="text-gray-700">
            Once your order is shipped, you will receive an email and SMS with a
            tracking link so you can follow your package in real-time.
          </p>
        </section>

        {/* Returns */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Returns & Exchanges</h2>
          <p className="text-gray-700">
            We want you to love your purchase. If something isn’t right, you can
            return or exchange your order within 7 days of delivery, provided
            the items are unused and in their original condition with tags
            intact.
          </p>
        </section>
      </div>

      {/* Customer Support */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-sm text-center">
        <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
        <p className="text-gray-700">
          Our customer support team is here 24/7. Contact us via the{" "}
          <a href="/contact" className="text-black font-medium hover:underline">
            Contact Page
          </a>{" "}
          for any assistance.
        </p>
      </div>
    </div>
  );
}
