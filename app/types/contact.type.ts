export interface IContactRequest {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export interface IContactResponse {
  message?: string;
  ticketId?: string;
}

