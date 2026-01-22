import { ROLES } from "@/generated/prisma/enums";
import { z } from "zod";

export const signUpDto = z.object({
	email: z.email(),
	name: z.string(),
	password: z.string(),
	role: z.enum([ROLES.CLIENT, ROLES.RESTAURANT_ADMIN]),
});

export type SignUpDto = z.infer<typeof signUpDto>;
