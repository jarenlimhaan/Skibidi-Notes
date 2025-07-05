import { z } from "zod";

export const userDTO = z.object({
  user_id: z.string().uuid(),
  username: z.string().min(3),
  email: z.string().email(),
});

export const userUpdateDTO = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  oldPassword : z.string().optional(),
  newPassword: z.string().optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateDTO>;
export type UserInput = z.infer<typeof userDTO>;
