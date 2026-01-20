import { z } from "zod";

export const getMyCompanyDto = z.object({
    id: z.uuidv4(),
    tradeName: z.string(),
    cnpj: z.string().min(14).max(14)
});

export type GetMyCompany = z.infer<typeof getMyCompanyDto>