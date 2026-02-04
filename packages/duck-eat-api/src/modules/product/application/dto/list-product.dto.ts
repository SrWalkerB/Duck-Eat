import { z } from "zod";

export const listProductsDto = z.array(
	z.object({
		id: z.uuid(),
		name: z.string(),
		description: z.string().nullable(),
		price: z.number(),
		companySessionProducts: z.array(z.object({
			companySession: z.object({
				id: z.uuid(),
				name: z.string()
			})
		})),
		productPhotos: z.array(
			z.object({
				photoUrl: z.string(),
			}),
		),
	}),
);

export type ListProduct = z.infer<typeof listProductsDto>;
