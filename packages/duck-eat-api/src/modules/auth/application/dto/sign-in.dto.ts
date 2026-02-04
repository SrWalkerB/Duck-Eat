import { z } from "zod";

export const signInDto = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export const signInResponseDto = z.object({
	accessToken: z.jwt(),
	refreshToken: z.jwt(),
});

export type SignInDto = z.infer<typeof signInDto>;
