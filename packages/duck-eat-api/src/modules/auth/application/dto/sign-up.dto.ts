import { ROLES } from "@/generated/prisma/enums";
import { z } from "zod";

export const signUpDto = z.object({
	account: z.object({
		email: z.email(),
		password: z.string().min(8),
		name: z.string(),
		role: z.enum([ROLES.CLIENT, ROLES.RESTAURANT_ADMIN]),
	}),
	company: z.object({
		tradeName: z.string(),
		cnpj: z.string(),
		companyTagId: z.uuid(),
		companyAbout: z.object({
			description: z.string(),
			address: z.string()
		})
	}),
});

export type SignUpDto = z.infer<typeof signUpDto>;
