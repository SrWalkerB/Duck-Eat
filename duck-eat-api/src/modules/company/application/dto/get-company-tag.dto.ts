import { z } from "zod";

export const getCompanyTagDto = z.array(
	z.object({
		id: z.uuid(),
		name: z.string(),
	}),
);

export type GetCompanyTag = z.infer<typeof getCompanyTagDto>;
