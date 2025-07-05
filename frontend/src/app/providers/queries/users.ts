"use client";
import { useMutation } from "@tanstack/react-query";
import { UserUpdateInput } from "@/lib/schemas/userSchema";
import axios from "axios";
import Swal from "sweetalert2";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useUpdateUser = (userId: string) => {
  return useMutation({
    mutationFn: (data: UserUpdateInput) =>
      axios.put(`${backendURL}/api/users/${userId}`, data).then((res) => res.data),

    onSuccess: () => {
      Swal.fire({
        title: "Updated Successfully",
        icon: "success",
        confirmButtonText: "Cool",
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Something went wrong";

      Swal.fire({
        title: "Update Failed",
        text: message,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    },
  });
};

