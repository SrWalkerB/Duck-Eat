import { z } from "zod";

export const createCompanyRequestDto = z.object({
	tradeName: z.string(),
	cnpj: z.string().min(14).max(14),
	companyTagId: z.uuid(),
	companyAbout: z.object({
		address: z.string(),
		description: z.string(),
	}),
});

export type CreateCompanyRequestDto = z.infer<typeof createCompanyRequestDto>;

export const createCompanyDto = z.object({
	tradeName: z.string(),
	cnpj: z.string().min(14).max(14),
	ownerId: z.uuid(),
	companyTagId: z.uuid(),
	companyAbout: z.object({
		description: z.string(),
		address: z.string(),
	}),
});

export type CreateCompanyDto = z.infer<typeof createCompanyDto>;

export const createCompanyResponseDto = z.object({
	companyId: z.uuid(),
});
