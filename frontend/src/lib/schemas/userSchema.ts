import { z } from "zod";

export const userDTO = z.object({
  id: z.string().uuid(),
  username: z.string().min(3),
  email: z.string().email(),
});

export type UserInput = z.infer<typeof userDTO>;
