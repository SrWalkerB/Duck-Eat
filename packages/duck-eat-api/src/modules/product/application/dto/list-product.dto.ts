import { z } from "zod";

export const listProductsDto = z.array(
	z.object({
		id: z.uuid(),
		name: z.string(),
	}),
);

export type ListProduct = z.infer<typeof listProductsDto>;
