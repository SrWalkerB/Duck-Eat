import { z } from "zod";

export const createSessionRequestDto = z.object({
  companyId: z.string(),
  name: z.string(),
});

export const createSessionDto = z.object({
  companyId: z.string(),
  organizationId: z.string(),
  name: z.string(),
});

export const createSessionResponseDto = z.object({
  id: z.string(),
});

export type CreateSession = z.infer<typeof createSessionDto>;
