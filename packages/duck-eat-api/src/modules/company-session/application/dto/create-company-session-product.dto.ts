import { z } from "zod";

export const createSessionProductRequestDto = z.object({
  companyId: z.string(),
  companySessionId: z.string(),
  productIds: z.array(z.uuid()).min(1),
});

export const createSessionProductDto = z.object({
  companyId: z.string(),
  companySessionId: z.string(),
  organizationId: z.uuid(),
  productIds: z.array(z.uuid()),
});

export type CreateSessionProduct = z.infer<typeof createSessionProductDto>;
