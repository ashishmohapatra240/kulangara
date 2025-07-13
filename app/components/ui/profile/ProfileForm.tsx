"use client";
import { useState, useEffect } from "react";
import { useProfile } from "@/app/hooks/useProfile";
import {
  IProfileUpdateRequest,
  IChangePasswordRequest,
} from "@/app/types/profile.type";

export const ProfileForm = () => {
  const {
    profile,
    isLoading,
    isUpdating,
    isChangingPassword,
    isDeleting,
    isChangePasswordModalOpen,
    setIsChangePasswordModalOpen,
    isDeleteAccountModalOpen,
    setIsDeleteAccountModalOpen,
    handleUpdateProfile,
    handleChangePassword,
    handleDeleteAccount,
  } = useProfile();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<IProfileUpdateRequest>({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState<IChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.user.firstName || "",
        lastName: profile.user.lastName || "",
        phone: profile.user.phone || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile(formData);
    setIsEditMode(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleChangePassword(passwordData);
    setPasswordData({ currentPassword: "", newPassword: "" });
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form data to original values
    if (profile) {
      setFormData({
        firstName: profile.user.firstName || "",
        lastName: profile.user.lastName || "",
        phone: profile.user.phone || "",
      });
    }
  };

  const handleOpenChangePassword = () => {
    setPasswordData({ currentPassword: "", newPassword: "" });
    setIsChangePasswordModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Unable to load profile information
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-30">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-normal">Profile Details</h1>
        {!isEditMode && (
          <button
            onClick={() => setIsEditMode(true)}
            className="px-6 py-2 bg-black text-white hover:bg-gray-800"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Profile Information */}
        <div className="border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-normal">Personal Information</h2>
          </div>

          {isEditMode ? (
            // Edit Form
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile.user.email}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium mb-2"
                >
                  Mobile Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-50"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 disabled:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // Read-only View
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    First Name
                  </label>
                  <p className="text-gray-900">
                    {profile.user.firstName || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Last Name
                  </label>
                  <p className="text-gray-900">
                    {profile.user.lastName || "Not provided"}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email Address
                </label>
                <p className="text-gray-900">{profile.user.email}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Mobile Number
                  </label>
                  <p className="text-gray-900">
                    {profile.user.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Member Since
                  </label>
                  <p className="text-gray-900">
                    {new Date(profile.user.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Actions */}
        <div className="border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-normal">Account Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-gray-600">
                  Update your account password
                </p>
              </div>
              <button
                onClick={handleOpenChangePassword}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50"
              >
                Change Password
              </button>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-600">Delete Account</h3>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button
                  onClick={() => setIsDeleteAccountModalOpen(true)}
                  className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {isChangePasswordModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 pt-30 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg">
              <h3 className="text-xl font-normal mb-4">Change Password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    disabled={isChangingPassword}
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    disabled={isChangingPassword}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none disabled:bg-gray-50"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordModalOpen(false)}
                    className="px-6 py-2 border border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {isDeleteAccountModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 pt-30 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg">
              <h3 className="text-xl font-normal mb-4 text-red-600">
                Delete Account
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot
                be undone and will permanently remove all your data, orders, and
                preferences.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsDeleteAccountModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
