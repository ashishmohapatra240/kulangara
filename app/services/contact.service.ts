import { publicAxios } from "../lib/axios";
import { IContactRequest, IContactResponse } from "../types/contact.type";

const contactService = {
  submitContact: async (payload: IContactRequest): Promise<IContactResponse> => {
    const response = await publicAxios.post("/api/v1/contact", payload);
    const data = response.data?.data ?? response.data ?? {};

    return {
      message: data.message ?? response.data?.message ?? "Thanks for reaching out!",
      ticketId: data.ticketId ?? data.id,
    };
  },
};

export default contactService;

