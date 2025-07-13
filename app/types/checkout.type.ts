export interface ICheckoutFormData {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export type PaymentMethod = "cashfree" | "razorpay" | "cod";