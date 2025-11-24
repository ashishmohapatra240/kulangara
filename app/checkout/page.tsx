"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";
import { PaymentMethod } from "@/app/types/checkout.type";
import { useCheckout } from "@/app/hooks/useCheckout";
import { useProfile } from "@/app/hooks/useProfile";
import { useCartValidation } from "@/app/hooks/useCartValidation";
import Modal from "@/app/components/ui/Modal";
import { IOrder } from "@/app/types/order.type";
import React from "react";
import { IAddress } from "@/app/types/profile.type";
import { isValidPincode } from "@/app/lib/validation";

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
      setSelectedAddress(defaultAddr || null);
      if (defaultAddr?.id) {
        setSelectedAddressId(defaultAddr.id);
      }
    }
  }, [typedAddresses, setSelectedAddressId]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("razorpay");
  const [formError, setFormError] = useState("");
  
  // Pincode availability checker
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [pincodeAvailable, setPincodeAvailable] = useState<boolean | null>(null);

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

  // Pincode validation and availability check with debounce
  useEffect(() => {
    // Reset states when pincode is cleared
    if (pincode === "") {
      setPincodeError("");
      setPincodeAvailable(null);
      setIsCheckingPincode(false);
      return;
    }

    // Validate format: must be exactly 6 digits
    if (pincode.length < 6) {
      setPincodeError("");
      setPincodeAvailable(null);
      setIsCheckingPincode(false);
      return;
    }

    // Check if all are numbers
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode)) {
      setPincodeError("Pincode must be exactly 6 numbers");
      setPincodeAvailable(null);
      setIsCheckingPincode(false);
      return;
    }

    // Validate using Indian pincode format (first digit should not be 0)
    if (!isValidPincode(pincode)) {
      setPincodeError("Invalid pincode format. First digit cannot be 0");
      setPincodeAvailable(null);
      setIsCheckingPincode(false);
      return;
    }

    // Clear error if format is valid
    setPincodeError("");

    // Debounce: Wait 1 second before checking availability
    setIsCheckingPincode(true);
    const timer = setTimeout(async () => {
      try {
        // Simulate API call - In production, replace with actual API endpoint
        // For now, we'll simulate availability check
        // You can replace this with: await axiosInstance.get(`/api/v1/delivery/check-pincode/${pincode}`)
        
        // Mock availability check (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        // Mock logic: Consider pincode available if it's valid format
        // In production, this would be an actual API call
        const isAvailable = true; // Replace with actual API response
        setPincodeAvailable(isAvailable);
      } catch (error) {
        console.error('Error checking pincode availability:', error);
        setPincodeAvailable(false);
      } finally {
        setIsCheckingPincode(false);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [pincode]);

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
    // React Query will automatically refresh addresses after successful mutation
    // The modal will stay open to show the updated address list
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
          <div className="space-y-6">
            {/* Delivery Section */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                {typedAddresses.length === 0 ? (
                  <div className="space-y-4">
                    <div className="text-muted-foreground">No addresses saved yet.</div>
                    <Button onClick={() => {
                      setShowAddressModal(true);
                      setShowAddForm(true);
                    }}>
                      Add New Address
                    </Button>
                  </div>
                ) : selectedAddress ? (
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="font-medium">
                        {selectedAddress.firstName} {selectedAddress.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedAddress.address}</p>
                      {selectedAddress.apartment && (
                        <p className="text-sm text-muted-foreground">{selectedAddress.apartment}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.pincode}
                      </p>
                      <p className="text-sm text-muted-foreground">{selectedAddress.phone}</p>
                      {selectedAddress.isDefault && (
                        <Badge variant="secondary" className="mt-2">Default</Badge>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowAddressModal(true)}>
                      Change
                    </Button>
                  </div>
                ) : (
                  <div className="text-muted-foreground">No address selected.</div>
                )}
              </CardContent>
            </Card>

            {/* Pincode Availability Checker */}
            <Card>
              <CardHeader>
                <CardTitle>Check Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="pincode-check">Check availability</Label>
                  <Input
                    id="pincode-check"
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={pincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
                      if (value.length <= 6) {
                        setPincode(value);
                      }
                    }}
                    maxLength={6}
                    className={pincodeError ? "border-destructive" : ""}
                  />
                  {pincodeError && (
                    <p className="text-sm text-destructive">{pincodeError}</p>
                  )}
                  {isCheckingPincode && pincode.length === 6 && !pincodeError && (
                    <p className="text-sm text-muted-foreground">Checking availability...</p>
                  )}
                  {!isCheckingPincode && pincode.length === 6 && !pincodeError && pincodeAvailable !== null && (
                    <div className="flex items-center gap-2">
                      {pincodeAvailable ? (
                        <>
                          <span className="text-sm text-green-600 font-medium">✓ Delivery available</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-destructive font-medium">✗ Delivery not available for this pincode</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All transactions are secure and encrypted.
                </p>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="mr-3"
                    />
                    <span className="text-sm font-medium">Razorpay Secure (UPI, Cards, Wallets, NetBanking)</span>
                  </label>

                  {/* <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mr-3"
                    />
                    <span className="text-sm font-medium">Cash on Delivery</span>
                  </label> */}
                </div>
              </CardContent>
            </Card>

            {/* Error Messages */}
            {(error || formError) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error || formError}
                </AlertDescription>
              </Alert>
            )}

            {validationResult?.available === false && (
              <Alert variant="destructive">
                <AlertDescription>
                  <h3 className="font-medium mb-1">Stock Issue Detected</h3>
                  <p className="mb-2">{validationResult.message}</p>
                  {validationResult.data?.invalidItems && validationResult.data.invalidItems.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium mb-1">Items with issues:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {validationResult.data.invalidItems.map((item, index) => (
                          <li key={index} className="text-sm">
                            Product issue: {item.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button
                    onClick={() => router.push('/cart')}
                    className="mt-3 text-sm underline hover:no-underline"
                  >
                    Review Cart
                  </button>
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
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

            {/* Address Modal */}
            <Modal isOpen={showAddressModal} onClose={() => {
              setShowAddressModal(false);
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
            }} maxWidth="max-w-xl">
              <div className="p-4">
                <h3 className="text-lg font-medium mb-4">Select Address</h3>
                {typedAddresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No addresses saved yet</p>
                    <Button onClick={() => setShowAddForm(true)}>Add New Address</Button>
                  </div>
                ) : (
                  <div className="space-y-4 mb-4">
                    {typedAddresses.map((address) => (
                      <Card key={address.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <p className="font-medium">{address.firstName} {address.lastName}</p>
                              <p className="text-sm text-muted-foreground">{address.address}</p>
                              {address.apartment && <p className="text-sm text-muted-foreground">{address.apartment}</p>}
                              <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.pincode}</p>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                              {address.isDefault && <Badge variant="secondary" className="mt-2">Default</Badge>}
                            </div>
                            <div className="flex flex-col gap-2">
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
                        </CardContent>
                      </Card>
                    ))}
                    <Button className="w-full mt-4" onClick={() => setShowAddForm(true)}>
                      Add New Address
                    </Button>
                  </div>
                )}
                {/* Add/Edit Address Form */}
                {showAddForm && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-base">{editingAddress ? "Edit Address" : "Add New Address"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              type="text"
                              placeholder="First name"
                              value={addressFormData.firstName}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              type="text"
                              placeholder="Last name"
                              value={addressFormData.lastName}
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
                            type="text"
                            placeholder="Address"
                            value={addressFormData.address}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apartment">Apartment (Optional)</Label>
                          <Input
                            id="apartment"
                            name="apartment"
                            type="text"
                            placeholder="Apartment, suite, etc."
                            value={addressFormData.apartment}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              type="text"
                              placeholder="City"
                              value={addressFormData.city}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              name="state"
                              type="text"
                              placeholder="State"
                              value={addressFormData.state}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="pincode">PIN Code</Label>
                            <Input
                              id="pincode"
                              name="pincode"
                              type="text"
                              placeholder="PIN code"
                              value={addressFormData.pincode}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="Phone number for order updates"
                            value={addressFormData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            id="isDefault"
                            name="isDefault"
                            type="checkbox"
                            checked={addressFormData.isDefault}
                            onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="isDefault" className="text-sm font-normal">
                            Set as default address
                          </Label>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                          <Button type="button" variant="outline" onClick={() => {
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
                          }}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isCreatingAddress || isUpdatingAddress}>
                            {isCreatingAddress || isUpdatingAddress ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </Modal>
          </div>

          {/* Order Summary Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item, index) => {
                    try {
                      if (!item || !item.product) return null;

                      return (
                        <div key={item.id || `item-${index}`} className="flex gap-4">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                            <Image
                              src={
                                item.product?.images?.[0]?.url ||
                                "/images/coming-soon.jpg"
                              }
                              alt={item.product?.name || "Product"}
                              fill
                              className="object-cover"
                            />
                            <Badge className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                              {item.quantity || 0}
                            </Badge>
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-sm">{item.product?.name || "Product"}</p>
                            <p className="text-xs text-muted-foreground mt-1">
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
                            <p className="font-medium text-sm mt-1">
                              {item.product?.discountedPrice && item.product.discountedPrice < item.price ? (
                                <>
                                  ₹{(item.product.discountedPrice * item.quantity).toLocaleString()}.00{' '}
                                  <span className="text-muted-foreground line-through text-xs">₹{(item.price * item.quantity).toLocaleString()}.00</span>
                                </>
                              ) : (
                                <>₹{(item.price * item.quantity).toLocaleString()}.00</>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    } catch (error) {
                      console.error('Error rendering cart item:', error, 'Item:', item);
                      return (
                        <Alert key={`error-${index}`} variant="destructive">
                          <AlertDescription className="text-xs">
                            Error loading cart item
                          </AlertDescription>
                        </Alert>
                      );
                    }
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Your cart is empty
                  </div>
                )}
              </div>

              <Separator />

              {/* Coupon Section */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Discount code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={loading || !couponCode.trim()}
                  >
                    Apply
                  </Button>
                </div>

                {appliedCoupon && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-800">
                          Coupon applied: {appliedCoupon.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          className="text-green-600 hover:text-green-800 h-auto p-0"
                        >
                          Remove
                        </Button>
                      </div>
                      <p className="text-xs text-green-700 mt-1">{appliedCoupon.description}</p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              {/* Price Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({cartItems?.length || 0} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toLocaleString()}.00</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">₹{total.toLocaleString()}.00</span>
                </div>
                <p className="text-xs text-muted-foreground">Including all taxes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
