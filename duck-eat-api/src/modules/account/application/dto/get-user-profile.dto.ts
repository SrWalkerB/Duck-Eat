import { z } from "zod";

export const getUserProfileDto = z.object({
	id: z.uuid(),
	name: z.string(),
	account: z.object({
		email: z.email(),
		role: z.string(),
	}),
});

export type GetUserProfile = z.infer<typeof getUserProfileDto>;
