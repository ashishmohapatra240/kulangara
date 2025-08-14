export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IRegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role?: string;
}

export interface IAuthResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    role: "SUPER_ADMIN" | "ADMIN" | "DELIVERY_PARTNER" | "CUSTOMER";
    };
}
