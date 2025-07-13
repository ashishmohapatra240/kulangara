"use client";
import { useState } from "react";
import { useProfile } from "@/app/hooks/useProfile";
import { IAddressCreateRequest, IAddress } from "@/app/types/profile.type";

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 pt-30">
        <h1 className="text-2xl font-normal">Saved Addresses</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-black text-white hover:bg-gray-800"
        >
          Add New Address
        </button>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No addresses saved yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-2 bg-black text-white hover:bg-gray-800"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 p-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-medium">
                  {address.firstName} {address.lastName}
                </h3>
                {address.isDefault && (
                  <span className="text-sm text-gray-500">Default Address</span>
                )}
              </div>
              <p className="text-gray-600 mb-2">
                {address.address}
                {address.apartment && `, ${address.apartment}`}
                <br />
                {address.city}, {address.state} {address.pincode}
              </p>
              <p className="text-gray-600 mb-4">Phone: {address.phone}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="text-sm underline"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    disabled={isSettingDefault}
                    className="text-sm underline text-gray-500"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  disabled={isDeletingAddress}
                  className="text-sm underline text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 pt-30">
          <div className="bg-white w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-medium mb-4">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 focus:border-black"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 focus:border-black"
                  required
                />
              </div>
              <div>
                <label htmlFor="apartment" className="block text-xs font-medium text-gray-700 mb-1">
                  Apartment/Suite (Optional)
                </label>
                <input
                  id="apartment"
                  name="apartment"
                  type="text"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 focus:border-black"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pincode" className="block text-xs font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 focus:border-black"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 focus:border-black"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center pt-2">
                <input
                  id="isDefault"
                  name="isDefault"
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="mr-2 h-4 w-4 border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="isDefault" className="text-sm">
                  Set as default address
                </label>
              </div>
              <div className="flex justify-end gap-4 mt-5">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingAddress || isUpdatingAddress}
                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {isCreatingAddress || isUpdatingAddress
                    ? "Saving..."
                    : editingAddress
                    ? "Update Address"
                    : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
