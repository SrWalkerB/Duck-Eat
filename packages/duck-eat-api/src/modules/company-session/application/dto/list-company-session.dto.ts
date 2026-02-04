import { z } from "zod";

export const listCompanySessionDto = z.array(
	z.object({
		id: z.uuid(),
		name: z.string(),
		company: z.object({
			id: z.string(),
			tradeName: z.string(),
		}),
	}),
);

export type ListCompanySession = z.infer<typeof listCompanySessionDto>;
