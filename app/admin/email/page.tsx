"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { FiSend, FiEye, FiEyeOff, FiUsers } from "react-icons/fi";
import useEmailComposer, { EMAIL_TEMPLATES } from "@/app/hooks/useEmailComposer";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export default function EmailPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Use the custom hook for email composition
  const {
    emailData,
    setEmailData,
    showPreview,
    setShowPreview,
    handleTemplateChange,
    addRecipient,
    removeRecipient,
    updateRecipient,
    handleSendEmail,
    sendEmailMutation,
  } = useEmailComposer();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/admin/login");
      } else if (!user || !ALLOWED_ROLES.includes(user.role)) {
        router.replace("/");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white border-0">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <AdminLayout>
      <div className="pt-30">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-normal">Email Composer</h1>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-0 hover:bg-gray-50"
          >
            {showPreview ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Form */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="bg-white border border-gray-200 rounded-0 p-6">
              <h2 className="text-lg font-medium mb-4">Email Template</h2>
              <select
                value={emailData.template}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select a template</option>
                {EMAIL_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipients */}
            <div className="bg-white border border-gray-200 rounded-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Recipients</h2>
                <button
                  onClick={addRecipient}
                  className="flex items-center space-x-2 px-3 py-1 text-sm bg-black text-white rounded-0 hover:bg-gray-800 cursor-pointer"
                >
                  <FiUsers className="w-4 h-4" />
                  <span>Add Recipient</span>
                </button>
              </div>
              <div className="space-y-3">
                {emailData.to.map((email, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      onClick={() => removeRecipient(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {emailData.to.length === 0 && (
                  <p className="text-gray-500 text-sm">No recipients added</p>
                )}
              </div>
            </div>

            {/* Email Content */}
            <div className="bg-white border border-gray-200 rounded-0 p-6">
              <h2 className="text-lg font-medium mb-4">Email Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    placeholder="Enter email subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview Text
                  </label>
                  <input
                    type="text"
                    value={emailData.previewText}
                    onChange={(e) => setEmailData({ ...emailData, previewText: e.target.value })}
                    placeholder="Brief preview text (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body *
                  </label>
                  <textarea
                    value={emailData.body}
                    onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                    placeholder="Enter email body (HTML supported)"
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={emailData.buttonText}
                      onChange={(e) => setEmailData({ ...emailData, buttonText: e.target.value })}
                      placeholder="Call to action text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Button URL
                    </label>
                    <input
                      type="url"
                      value={emailData.buttonUrl}
                      onChange={(e) => setEmailData({ ...emailData, buttonUrl: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={emailData.footerText}
                    onChange={(e) => setEmailData({ ...emailData, footerText: e.target.value })}
                    placeholder="Footer text (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-0 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Send Button */}
            <div className="bg-white border border-gray-200 rounded-0 p-6">
              <button
                onClick={handleSendEmail}
                disabled={sendEmailMutation.isPending}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white rounded-0 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FiSend className="w-5 h-5" />
                <span>{sendEmailMutation.isPending ? "Sending..." : "Send Email"}</span>
              </button>
            </div>
          </div>

          {/* Email Preview */}
          {showPreview && (
            <div className="bg-white border border-gray-200 rounded-0 p-6">
              <h2 className="text-lg font-medium mb-4">Email Preview</h2>
              <div className="border border-gray-300 rounded-0 p-4 bg-gray-50">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">To: {emailData.to.join(", ") || "No recipients"}</p>
                  <p className="text-sm text-gray-600">Subject: {emailData.subject || "No subject"}</p>
                  {emailData.previewText && (
                    <p className="text-sm text-gray-600">Preview: {emailData.previewText}</p>
                  )}
                </div>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: emailData.body || "<p>No content</p>" }}
                />
                {emailData.buttonText && emailData.buttonUrl && (
                  <div className="mt-4">
                    <a
                      href={emailData.buttonUrl}
                      className="inline-block px-6 py-2 bg-black text-white rounded-0 hover:bg-gray-800"
                    >
                      {emailData.buttonText}
                    </a>
                  </div>
                )}
                {emailData.footerText && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <p className="text-sm text-gray-600">{emailData.footerText}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
} 