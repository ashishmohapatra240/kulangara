"use client";

import React, { useState } from "react";

const faqs = [
  {
    question: "What makes Kulangara t-shirts unique?",
    answer:
      "Our t-shirts are crafted with premium cotton blends, designed for comfort, durability, and minimalist style.",
  },
  {
    question: "What sizes do you offer?",
    answer:
      "We offer sizes from XS to XXXL. You can check our detailed size guide for exact measurements.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide. Shipping charges and delivery times vary depending on the destination.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders within India are delivered in 3–5 business days. International orders may take 7–14 business days.",
  },
  {
    question: "What are your shipping charges?",
    answer:
      "We offer free shipping on orders above ₹999 in India. For international orders, charges are calculated at checkout.",
  },
  {
    question: "Can I return or exchange my order?",
    answer:
      "Yes, we have a hassle-free return & exchange policy within 7 days of delivery, as long as items are unworn and tags intact.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you’ll receive a tracking link via email and SMS to monitor delivery progress.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards, UPI, Net Banking, and Wallets. For international customers, PayPal is supported.",
  },
  {
    question: "Do you offer discounts on bulk orders?",
    answer:
      "Yes, for bulk or corporate orders, please contact our support team for special pricing.",
  },
  {
    question: "How can I contact Kulangara support?",
    answer:
      "You can reach us through the Contact page, or email us at contact.kulangara@gmail.com for quick assistance.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 {josefin.className}">
      {/* Page Title */}
      <div className="mt-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 ">
        Frequently Asked Questions
      </h1>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg shadow-sm bg-white"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left text-lg font-medium text-gray-900 hover:bg-gray-50 transition"
            >
              {faq.question}
              <span className="ml-4 text-xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
