export interface IProfile {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'DELIVERY_PARTNER';
    createdAt: string;
    updatedAt: string;
  }
}

export interface IProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface IProfileResponse {
  success: boolean;
  message: string;
  data: IProfile;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface IAddress {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAddressResponse {
  success: boolean;
  message: string;
  data: {
    addresses: IAddress[];
  };
}

export interface ISingleAddressResponse {
  success: boolean;
  message: string;
  data: IAddress;
}

export interface IAddressCreateRequest {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export interface IAddressUpdateRequest {
  firstName?: string;
  lastName?: string;
  address?: string;
  apartment?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  isDefault?: boolean;
}