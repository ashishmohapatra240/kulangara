"use client";
import { useState } from "react";
import { useProfile } from "@/app/hooks/useProfile";
import { IAddressCreateRequest, IAddress } from "@/app/types/profile.type";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
import { Card, CardContent } from "../card";
import { Badge } from "../badge";

export const AddressSection = () => {
  const {
    addresses,
    isLoadingAddresses,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSettingDefault,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  } = useProfile();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState<IAddressCreateRequest>({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      handleUpdateAddress(editingAddress, formData);
    } else {
      handleCreateAddress(formData);
    }
    handleCloseForm();
  };

  const handleEditAddress = (address: IAddress) => {
    setEditingAddress(address.id);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      apartment: address.apartment,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      isDefault: false,
    });
  };

  const handleSetDefault = (id: string) => {
    handleSetDefaultAddress(id);
  };

  if (isLoadingAddresses) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 pt-30">
        <h1 className="text-2xl font-normal">Saved Addresses</h1>
        <Button onClick={() => setShowAddForm(true)}>
          Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No addresses saved yet</p>
            <Button onClick={() => setShowAddForm(true)}>
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">
                      {address.firstName} {address.lastName}
                    </h3>
                    {address.isDefault && (
                      <Badge variant="secondary" className="mt-1">Default</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={isDeletingAddress}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{address.address}</p>
                  {address.apartment && <p>{address.apartment}</p>}
                  <p>
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p>Phone: {address.phone}</p>
                </div>
                {!address.isDefault && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    disabled={isSettingDefault}
                    className="mt-4 p-0 h-auto"
                  >
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showAddForm && (
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartment">Apartment, Suite, etc.</Label>
                <Input
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                  Set as default address
                </Label>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseForm}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatingAddress || isUpdatingAddress}
                >
                  {isCreatingAddress || isUpdatingAddress
                    ? "Saving..."
                    : editingAddress
                    ? "Update Address"
                    : "Add Address"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
