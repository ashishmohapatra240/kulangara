"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/layout/AdminLayout";
import { FiSend, FiEye, FiEyeOff, FiUsers } from "react-icons/fi";
import useEmailComposer, { EMAIL_TEMPLATES } from "@/app/hooks/useEmailComposer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";

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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-base font-medium text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-white">
        <div className="flex justify-between items-center pt-30 mb-12 pb-6 border-b-2 border-black">
          <h1 className="text-4xl font-bold tracking-tight">EMAIL COMPOSER</h1>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-3 px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors font-bold tracking-widest"
          >
            {showPreview ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            <span>{showPreview ? "HIDE PREVIEW" : "SHOW PREVIEW"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Form */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="bg-white border-2 border-black p-8">
              <h2 className="text-2xl font-bold mb-6 tracking-tight">EMAIL TEMPLATE</h2>
              <select
                value={emailData.template}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium"
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
            <div className="bg-white border-2 border-black p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold tracking-tight">RECIPIENTS</h2>
                <button
                  onClick={addRecipient}
                  className="flex items-center space-x-3 px-4 py-2 text-sm bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-colors cursor-pointer font-bold tracking-widest"
                >
                  <FiUsers className="w-5 h-5" />
                  <span>ADD RECIPIENT</span>
                </button>
              </div>
              <div className="space-y-3">
                {emailData.to.map((email, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateRecipient(index, e.target.value)}
                      placeholder="ENTER EMAIL ADDRESS"
                      className="flex-1 px-4 py-3 border-2 border-black focus:outline-none font-medium placeholder:text-gray-500"
                    />
                    <button
                      onClick={() => removeRecipient(index)}
                      className="px-4 py-3 text-black border-2 border-black hover:bg-black hover:text-white transition-colors font-bold tracking-widest"
                    >
                      REMOVE
                    </button>
                  </div>
                ))}
                {emailData.to.length === 0 && (
                  <p className="text-gray-600 text-sm font-medium tracking-wide">NO RECIPIENTS ADDED</p>
                )}
              </div>
            </div>

            {/* Email Content */}
            <div className="bg-white border-2 border-black p-8">
              <h2 className="text-2xl font-bold mb-6 tracking-tight">EMAIL CONTENT</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-3 tracking-widest">
                    SUBJECT *
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    placeholder="ENTER EMAIL SUBJECT"
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-3 tracking-widest">
                    PREVIEW TEXT
                  </label>
                  <input
                    type="text"
                    value={emailData.previewText}
                    onChange={(e) => setEmailData({ ...emailData, previewText: e.target.value })}
                    placeholder="BRIEF PREVIEW TEXT (OPTIONAL)"
                    className="w-full px-4 py-3 border-2 border-black focus:outline-none font-medium placeholder:text-gray-500"
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
            <div className="bg-white border-2 border-black p-8">
              <button
                onClick={handleSendEmail}
                disabled={sendEmailMutation.isPending}
                className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold tracking-widest"
              >
                <FiSend className="w-6 h-6" />
                <span>{sendEmailMutation.isPending ? "SENDING..." : "SEND EMAIL"}</span>
              </button>
            </div>
          </div>

          {/* Email Preview */}
          {showPreview && (
            <div className="bg-white border-2 border-black p-8">
              <h2 className="text-2xl font-bold mb-6 tracking-tight">EMAIL PREVIEW</h2>
              <div className="border-2 border-black p-6 bg-white">
                <div className="mb-6 pb-4 border-b-2 border-black">
                  <p className="text-sm font-bold text-black tracking-wide">TO: {emailData.to.join(", ") || "NO RECIPIENTS"}</p>
                  <p className="text-sm font-bold text-black tracking-wide">SUBJECT: {emailData.subject || "NO SUBJECT"}</p>
                  {emailData.previewText && (
                    <p className="text-sm font-medium text-gray-600 tracking-wide">PREVIEW: {emailData.previewText}</p>
                  )}
                </div>
                <div
                  className="prose max-w-none text-black"
                  dangerouslySetInnerHTML={{ __html: emailData.body || "<p>NO CONTENT</p>" }}
                />
                {emailData.buttonText && emailData.buttonUrl && (
                  <div className="mt-6">
                    <a
                      href={emailData.buttonUrl}
                      className="inline-block px-6 py-3 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-colors font-bold tracking-widest"
                    >
                      {emailData.buttonText.toUpperCase()}
                    </a>
                  </div>
                )}
                {emailData.footerText && (
                  <div className="mt-6 pt-4 border-t-2 border-black">
                    <p className="text-sm font-medium text-gray-600 tracking-wide">{emailData.footerText}</p>
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