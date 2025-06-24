"use client";
import { userDTO } from "@/lib/schemas/userSchema";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axios.get(`http://localhost:8000/api/users`).then((res) => res.data),
  });

export const useUserByUsername = (username: string) => {
  return useQuery({
    queryKey: ["users", username],
    queryFn: async () => {
      const res = await axios.get(`${backendURL}/api/users/${username}`);
      return userDTO.parse(res.data);
    },
    enabled: !!username,
  });
};
