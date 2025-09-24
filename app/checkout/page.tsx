"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Button from "@/app/components/ui/Button";
import { PaymentMethod } from "@/app/types/checkout.type";
import { useCheckout } from "@/app/hooks/useCheckout";
import { useProfile } from "@/app/hooks/useProfile";
import { useCartValidation } from "@/app/hooks/useCartValidation";
import Modal from "@/app/components/ui/Modal";
import { IOrder } from "@/app/types/order.type";
import React from "react";
import { IAddress } from "@/app/types/profile.type";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cartItems: rawCartItems,
    couponCode,
    appliedCoupon,
    loading,
    error,
    subtotal,
    discount,
    total,
    paymentStatus,
    setCouponCode,
    applyCoupon,
    removeCoupon,
    createOrder,
    // sync selected address with order creation
    setSelectedAddressId,
  } = useCheckout();

  // Safely filter and validate cart items to prevent undefined access
  const cartItems = useMemo(() => {
    if (!rawCartItems || !Array.isArray(rawCartItems)) return [];
    return rawCartItems.filter(item =>
      item &&
      item.id &&
      item.product &&
      item.quantity > 0
    );
  }, [rawCartItems]);

  // Add comprehensive error handling to catch the specific color property error
  useEffect(() => {
    console.log('🔍 Error handler initialized on checkout page');
    const handleError = (event: ErrorEvent) => {
      if (event.error && event.error.message.includes("Cannot read properties of undefined (reading 'color')")) {
        console.error('🚨 COLOR ERROR CAUGHT!');
        console.error('Error message:', event.error.message);
        console.error('Error stack:', event.error.stack);
        console.error('Error occurred at:', event.filename, event.lineno, event.colno);
        console.error('Current rawCartItems:', JSON.stringify(rawCartItems, null, 2));
        console.error('Current cartItems:', JSON.stringify(cartItems, null, 2));
        console.error('Error context: checkout page rendering cart items');

        // Try to identify which item is causing the issue
        if (rawCartItems && rawCartItems.length > 0) {
          rawCartItems.forEach((item, index) => {
            console.error(`Item ${index}:`, {
              id: item?.id,
              hasProduct: !!item?.product,
              hasVariant: !!item?.variant,
              variantType: typeof item?.variant,
              variantKeys: item?.variant ? Object.keys(item.variant) : 'no variant'
            });
          });
        }
      }
    };

    window.addEventListener('error', handleError);

    // Also catch unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && event.reason.message && event.reason.message.includes("Cannot read properties of undefined (reading 'color')")) {
        console.error('🚨 COLOR ERROR in Promise:', event.reason);
        console.error('🚨 Promise rejection stack:', event.reason.stack);
      }
    };

    // Override console.error to catch toast errors
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      const message = args.join(' ');
      if (message.includes("Cannot read properties of undefined (reading 'color')")) {
        console.log('🚨 INTERCEPTED CONSOLE ERROR:', args);
        console.log('🚨 Error origin stack trace:');
        console.trace();
      }
      originalConsoleError.apply(console, args);
    };

    // Monitor toast library for color errors
    const checkToastErrors = () => {
      const toastElements = document.querySelectorAll('[data-sonner-toast]');
      toastElements.forEach((toast) => {
        if (toast.textContent?.includes("Cannot read properties of undefined (reading 'color')")) {
          console.error('🚨 FOUND COLOR ERROR IN TOAST:', toast.textContent);
          console.error('🚨 Toast element:', toast);
          console.trace('🚨 Stack trace when toast was found:');
        }
      });
    };

    // Check for toast errors periodically
    const toastInterval = setInterval(checkToastErrors, 100);

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearInterval(toastInterval);
    };
  }, [rawCartItems, cartItems]);

  const {
    addresses,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSettingDefault,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  } = useProfile();

  const {
    validateCart,
    validationResult,
    clearValidationResult,
    isValidating
  } = useCartValidation();

  const typedAddresses = addresses as IAddress[];
  const defaultAddress = typedAddresses.find((a) => a.isDefault) || typedAddresses[0];
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(defaultAddress || null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  // For address modal form only
  const [addressFormData, setAddressFormData] = useState({
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

  useEffect(() => {
    if (typedAddresses.length > 0) {
      const defaultAddr = typedAddresses.find(a => a.isDefault) || typedAddresses[0];
      setSelectedAddress(defaultAddr);
      if (defaultAddr?.id) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [typedAddresses, setSelectedAddressId]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [formError, setFormError] = useState("");

  // Clear errors when cart becomes empty and clean up any stale data
  useEffect(() => {
    if (cartItems.length === 0) {
      setFormError("");
      // Clear any potential client-side cache that might have malformed data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart-cache');
        sessionStorage.removeItem('cart-data');
      }
    }
  }, [cartItems.length]);

  const handleApplyCoupon = async () => {
    setFormError("");
    await applyCoupon(couponCode);
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    clearValidationResult();

    try {
      const isValid = await validateCart(cartItems);
      if (!isValid) {
        setFormError("Some items in your cart are no longer available. Please review your cart.");
        return;
      }

      const order = await createOrder(paymentMethod) as IOrder;
      if (order && order.id) {
        router.push(`/orders/${order.id}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message?.includes('Insufficient stock') || err.message?.includes('out of stock')) {
          setFormError("Some items are no longer available. Please review your cart and try again.");
          return;
        }
        setFormError(err.message);
      } else {
        setFormError("An unknown error occurred");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      handleUpdateAddress(editingAddress, addressFormData);
    } else {
      handleCreateAddress(addressFormData);
    }
    setShowAddForm(false);
    setEditingAddress(null);
    setAddressFormData({
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

  const handleEditAddress = (address: IAddress) => {
    setEditingAddress(address.id);
    setAddressFormData({
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

  const handleSelectAddress = (address: IAddress) => {
    setSelectedAddress(address);
    if (address?.id) {
      setSelectedAddressId(address.id);
    }
    setShowAddressModal(false);
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="container mx-auto px-4 py-8 max-w-6xl mt-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Delivery</h2>
              {/* Show only default/selected address */}
              {typedAddresses.length === 0 ? (
                <div className="mb-4 text-gray-500">No addresses saved yet.</div>
              ) : selectedAddress ? (
                <div className="mb-4 border border-gray-300 p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {selectedAddress.firstName} {selectedAddress.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedAddress.address}</p>
                    {selectedAddress.apartment && (
                      <p className="text-sm text-gray-600">{selectedAddress.apartment}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
                    </p>
                    <p className="text-sm text-gray-600">{selectedAddress.phone}</p>
                    {selectedAddress.isDefault && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => setShowAddressModal(true)}>
                    Change Address
                  </Button>
                </div>
              ) : (
                <div className="mb-4 text-gray-500">No address selected.</div>
              )}

              {/* Address Modal */}
              <Modal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} maxWidth="max-w-xl">
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-4">Select Address</h3>
                  {typedAddresses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No addresses saved yet</p>
                      <Button onClick={() => setShowAddForm(true)}>Add New Address</Button>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-4">
                      {typedAddresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 p-4 rounded flex justify-between items-center">
                          <div>
                            <p className="font-medium">{address.firstName} {address.lastName}</p>
                            <p className="text-sm text-gray-600">{address.address}</p>
                            {address.apartment && <p className="text-sm text-gray-600">{address.apartment}</p>}
                            <p className="text-sm text-gray-600">{address.city}, {address.state} {address.pincode}</p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                            {address.isDefault && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>}
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <Button size="sm" onClick={() => handleSelectAddress(address)}>
                              Select
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditAddress(address)}>
                              Edit
                            </Button>
                            {!address.isDefault && (
                              <Button size="sm" variant="outline" onClick={() => handleSetDefaultAddress(address.id)} disabled={isSettingDefault}>
                                Set Default
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleDeleteAddress(address.id)} disabled={isDeletingAddress}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button className="w-full mt-4" onClick={() => setShowAddForm(true)}>
                        Add New Address
                      </Button>
                    </div>
                  )}
                  {/* Add/Edit Address Form */}
                  {showAddForm && (
                    <div className="bg-gray-50 p-4 rounded mt-4">
                      <h4 className="text-md font-medium mb-2">{editingAddress ? "Edit Address" : "Add New Address"}</h4>
                      <form onSubmit={handleAddressSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            name="firstName"
                            type="text"
                            placeholder="First name"
                            value={addressFormData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                            required
                          />
                          <input
                            name="lastName"
                            type="text"
                            placeholder="Last name"
                            value={addressFormData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                            required
                          />
                        </div>
                        <input
                          name="address"
                          type="text"
                          placeholder="Address"
                          value={addressFormData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                          required
                        />
                        <input
                          name="apartment"
                          type="text"
                          placeholder="Apartment, suite, etc. (optional)"
                          value={addressFormData.apartment}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <input
                            name="city"
                            type="text"
                            placeholder="City"
                            value={addressFormData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                            required
                          />
                          <input
                            name="state"
                            type="text"
                            placeholder="State"
                            value={addressFormData.state}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                            required
                          />
                          <input
                            name="pincode"
                            type="text"
                            placeholder="PIN code"
                            value={addressFormData.pincode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                            required
                          />
                        </div>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="Phone number for order updates"
                          value={addressFormData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none"
                          required
                        />
                        <div className="flex items-center pt-2">
                          <input
                            id="isDefault"
                            name="isDefault"
                            type="checkbox"
                            checked={addressFormData.isDefault}
                            onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                            className="mr-2 h-4 w-4 border-gray-300 text-black focus:ring-black"
                          />
                          <label htmlFor="isDefault" className="text-sm">
                            Set as default address
                          </label>
                        </div>
                        <div className="flex justify-end gap-4 mt-5">
                          <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingAddress(null); }}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isCreatingAddress || isUpdatingAddress}>
                            {isCreatingAddress || isUpdatingAddress ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </Modal>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Payment</h2>
              <p className="text-sm text-gray-600 mb-4">
                All transactions are secure and encrypted.
              </p>

              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                    className="mr-2"
                  />
                  <span>Razorpay Secure (UPI, Cards, Wallets, NetBanking)</span>
                </label>

                <label className="flex items-center p-4 border border-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mr-2"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            {(error || formError) && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error || formError}
              </div>
            )}

            {validationResult?.available === false && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Stock Issue Detected
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {validationResult.message}
                    </p>
                    {validationResult.data?.invalidItems && validationResult.data.invalidItems.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-red-800 mb-1">Items with issues:</p>
                        <ul className="text-sm text-red-700 list-disc list-inside">
                          {validationResult.data.invalidItems.map((item, index) => (
                            <li key={index}>
                              Product issue: {item.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button
                      onClick={() => router.push('/cart')}
                      className="mt-3 text-sm text-red-800 hover:text-red-900 underline"
                    >
                      Review Cart
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={loading || isValidating || !cartItems || cartItems.length === 0 || (validationResult?.available === false)}
            >
              {isValidating ? "Validating cart..." :
                loading ?
                  paymentStatus === 'creating_order' ? "Creating order..." :
                    paymentStatus === 'payment_pending' ? "Processing payment..." :
                      paymentStatus === 'verifying' ? "Verifying payment..." :
                        "Processing..." :
                  validationResult?.available === false ? "Resolve Stock Issues" :
                    "Pay now"}
            </Button>
          </div>

          <div className="bg-gray-50 p-6">
            <div className="space-y-4">
              {cartItems && cartItems.length > 0 ? (
                cartItems.map((item, index) => {
                  try {
                    if (!item || !item.product) return null;

                    return (
                      <div key={item.id || `item-${index}`} className="flex gap-4">
                        <div className="relative w-16 h-16">
                          <Image
                            src={
                              item.product?.images?.[0]?.url ||
                              "/images/coming-soon.jpg"
                            }
                            alt={item.product?.name || "Product"}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                            {item.quantity || 0}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{item.product?.name || "Product"}</p>
                          <p className="text-sm text-gray-500">
                            {(() => {
                              try {
                                if (item.variant && typeof item.variant === 'object' && item.variant !== null) {
                                  const size = item.variant?.size || "N/A";
                                  const color = item.variant?.color || "Standard";
                                  return `${size} / ${color}`;
                                }
                                return "Standard";
                              } catch (variantError) {
                                console.error('Variant error:', variantError, 'Item:', item);
                                return "Standard";
                              }
                            })()}
                          </p>
                        </div>
                        <p className="font-medium">
                          {item.product?.discountedPrice && item.product.discountedPrice < item.price ? (
                            <>
                              ₹{(item.product.discountedPrice * item.quantity).toLocaleString()}.00{' '}
                              <span className="text-gray-500 line-through text-sm">₹{(item.price * item.quantity).toLocaleString()}.00</span>
                            </>
                          ) : (
                            <>₹{(item.price * item.quantity).toLocaleString()}.00</>
                          )}
                        </p>
                      </div>
                    );
                  } catch (error) {
                    console.error('Error rendering cart item:', error, 'Item:', item);
                    return (
                      <div key={`error-${index}`} className="text-red-500 text-sm p-2">
                        Error loading cart item
                      </div>
                    );
                  }
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Your cart is empty
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Discount code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 focus:outline-none"
                />
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={handleApplyCoupon}
                  disabled={loading || !couponCode.trim()}
                >
                  Apply
                </Button>
              </div>

              {appliedCoupon && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  <div className="flex justify-between items-center">
                    <span>Coupon applied: {appliedCoupon.code}</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-800"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm mt-1">{appliedCoupon.description}</p>
                </div>
              )}

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal · {cartItems?.length || 0} items</span>
                  <span>₹{subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}.00</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Including all taxes</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
