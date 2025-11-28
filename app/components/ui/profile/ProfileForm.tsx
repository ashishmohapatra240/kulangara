"use client";
import { useState, useEffect } from "react";
import { useProfile } from "@/app/hooks/useProfile";
import {
  IProfileUpdateRequest,
  IChangePasswordRequest,
} from "@/app/types/profile.type";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../card";

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Unable to load profile information
          </p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:pt-1">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-normal">Profile Details</h1>
        {!isEditMode && (
          <Button onClick={() => setIsEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>

          {isEditMode ? (
            // Edit Form
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isUpdating}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.user.email}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isUpdating}
                />
              </div>
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            // Read-only View
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">First Name</Label>
                  <p className="text-foreground mt-2">
                    {profile.user.firstName || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Name</Label>
                  <p className="text-foreground mt-2">
                    {profile.user.lastName || "Not provided"}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Email Address</Label>
                <p className="text-foreground mt-2">{profile.user.email}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">Mobile Number</Label>
                  <p className="text-foreground mt-2">
                    {profile.user.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Member Since</Label>
                  <p className="text-foreground mt-2">
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
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                  Update your account password
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleOpenChangePassword}
              >
                Change Password
              </Button>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-destructive">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteAccountModalOpen(true)}
                  className="border-destructive text-destructive hover:bg-destructive/10"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Modal */}
        <Dialog open={isChangePasswordModalOpen} onOpenChange={setIsChangePasswordModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  disabled={isChangingPassword}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  disabled={isChangingPassword}
                  required
                  minLength={6}
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Account Modal */}
        <Dialog open={isDeleteAccountModalOpen} onOpenChange={setIsDeleteAccountModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              Are you sure you want to delete your account? This action cannot
              be undone and will permanently remove all your data, orders, and
              preferences.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteAccountModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
