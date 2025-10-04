import React from "react";

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 {josefin.className}">
      {/* Page Title */}
      <div className="mt-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 ">
        Return & Exchange Policy
      </h1>
      </div>

      {/* Intro */}
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        At <span className="font-semibold">Kulangara</span>, we want you to be
        completely satisfied with your purchase. If something doesn’t feel
        right, our hassle-free returns and exchange policy is here to help.
      </p>

      {/* Sections */}
      <div className="space-y-10">
        {/* Eligibility */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Return & Exchange Eligibility
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Items must be returned within 7 days of delivery.</li>
            <li>
              Products should be unused, unwashed, and in their original
              packaging with tags intact.
            </li>
            <li>
              Sale or discounted items may not be eligible for return unless
              faulty.
            </li>
          </ul>
        </section>

        {/* Process */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">How to Initiate a Return</h2>
          <ol className="list-decimal pl-6 text-gray-700 space-y-2">
            <li>
              Visit our{" "}
              <a href="/contact" className="text-black font-medium hover:underline">
                Contact Page
              </a>{" "}
              or email us at{" "}
              <span className="font-semibold">support@kulangara.com</span>.
            </li>
            <li>
              Provide your order number and details of the item you wish to
              return/exchange.
            </li>
            <li>
              Our team will guide you with the return process and shipping
              instructions.
            </li>
          </ol>
        </section>

        {/* Refunds */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
          <p className="text-gray-700">
            Refunds will be processed once the returned product passes our
            quality check. Refunds will be credited to your original payment
            method within 5–7 business days.
          </p>
        </section>

        {/* Exchanges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
          <p className="text-gray-700">
            If you need a different size or color, we’re happy to exchange your
            item based on availability. Exchanges are free of charge for orders
            within India.
          </p>
        </section>
      </div>

      {/* Support Box */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-sm text-center">
        <h3 className="text-xl font-semibold mb-2">Need More Help?</h3>
        <p className="text-gray-700">
          Reach out to our support team anytime for assistance with returns or
          exchanges. We’re here to make your shopping experience better.
        </p>
      </div>
    </div>
  );
}
