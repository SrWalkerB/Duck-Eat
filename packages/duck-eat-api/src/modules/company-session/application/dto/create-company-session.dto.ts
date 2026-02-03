import { z } from "zod";

export const createCompanySessionRequestDto = z.object({
  companyId: z.string(),
  name: z.string(),
});

export const createCompanySessionDto = z.object({
  companyId: z.string(),
  organizationId: z.string(),
  name: z.string(),
});

export const createCompanySessionResponseDto = z.object({
  id: z.string(),
});

export type CreateCompanySession = z.infer<typeof createCompanySessionDto>;
