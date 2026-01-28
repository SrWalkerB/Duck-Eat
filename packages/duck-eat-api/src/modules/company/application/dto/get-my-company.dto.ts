import { z } from "zod";

export const getMyCompanyDto = z.array(
	z.object({
		id: z.uuidv4(),
		tradeName: z.string(),
		cnpj: z.string().min(14).max(14),
		companyTag: z.object({
			id: z.uuid(),
			name: z.string(),
		}),
	}),
);

export type GetMyCompanies = z.infer<typeof getMyCompanyDto>;
