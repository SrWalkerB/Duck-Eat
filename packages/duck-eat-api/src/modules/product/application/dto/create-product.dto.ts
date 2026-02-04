import { z } from "zod";

export const createProductRequestDto = z.object({
	name: z.string(),
	description: z.string().nullable(),
	price: z.float64(),
});

export const createProductDto = z.object({
	name: z.string(),
	price: z.float64(),
	description: z.string().nullable(),
	organizationId: z.string(),
});

export const createProductResponse = z.object({
	id: z.uuid(),
});

export type CreateProduct = z.infer<typeof createProductDto>;
