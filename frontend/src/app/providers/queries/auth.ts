import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { RegisterInput } from "./types/auth/types";
import { LoginInput } from "./types/auth/types";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export function useRegisterUser() {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await axios.post(`${backendURL}/api/auth/register`, data);
      return response.data;
    },
  });
}

export function useLoginUser() {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await axios.post(`${backendURL}/api/auth/login`, data);
      return response.data; 
    },
  });
}