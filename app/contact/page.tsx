"use client";

import React, { useState } from "react";
import Modal from "../components/ui/Modal";
import { useContact } from "../hooks/useContact";

const initialForm = { name: "", email: "", message: "" };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const { submitContact, isSubmitting } = useContact();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContact(form);
      setSubmittedName(form.name);
      setIsModalOpen(true);
      setForm(initialForm);
    } catch {
      // Errors are surfaced via toast in useContact
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Page Title */}
      <div className="mt-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 ">
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
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>

      <div className="mt-12 text-center text-gray-700">
        <p>
          Email:{" "}
          <span className="font-medium">contact.kulangara@gmail.com</span>
        </p>
        <p>
          Phone: <span className="font-medium">+91 9938616555</span>
        </p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="max-w-lg"
      >
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg
              aria-hidden="true"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Thank you!</h2>
            <p className="text-gray-600">
              {submittedName ? `${submittedName}, ` : ""}your message has been
              received. Our team will get back to you shortly.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
