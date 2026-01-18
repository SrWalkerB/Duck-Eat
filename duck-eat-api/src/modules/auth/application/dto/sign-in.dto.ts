import { z } from "zod";

export const signInDto = z.object({
  email: z.email(),
  password: z.string().min(8)
});

export type SignInDto = z.infer<typeof signInDto>;