"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log. You can integrate with backend or email API later.
    console.log("Form submitted:", form);
    alert("Thank you for contacting Kulangara! We’ll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 font-sans">
      {/* Page Title */}
      <div className="mt-14">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 underline">
        Contact Us
      </h1>
      </div>

      <p className="text-gray-600 text-center mb-12">
        Have a question, feedback, or just want to say hello? We’d love to hear
        from you.
      </p>

      {/* Contact Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Send Message
        </button>
      </form>

      {/* Contact Info */}
      <div className="mt-12 text-center text-gray-700">
        <p>Email: <span className="font-medium">support@kulangara.com</span></p>
        <p>Phone: <span className="font-medium">+91 98765 43210</span></p>
      </div>
    </div>
  );
}
