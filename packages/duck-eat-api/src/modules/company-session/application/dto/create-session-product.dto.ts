import { z } from "zod";

export const createSessionProductRequestDto = z.object({
  companyId: z.string(),
  name: z.string(),
});

export const createSessionProductDto = z.object({
  companyId: z.string(),
  organizationId: z.string(),
  name: z.string(),
});

export type CreateSessionProduct = z.infer<typeof createSessionProductDto>;
