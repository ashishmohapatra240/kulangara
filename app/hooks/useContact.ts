import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import contactService from "../services/contact.service";
import { IContactRequest, IContactResponse } from "../types/contact.type";
import { getErrorMessage } from "../lib/utils";

export const useContact = () => {
  const mutation = useMutation<IContactResponse, AxiosError, IContactRequest>({
    mutationFn: contactService.submitContact,
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  return {
    submitContact: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    response: mutation.data,
  };
};

