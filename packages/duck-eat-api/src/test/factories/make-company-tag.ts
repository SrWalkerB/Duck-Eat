import { randomUUID } from "node:crypto";
import type { CompanyTag } from "@/generated/prisma/client";

export function makeCompanyTag(override?: Partial<CompanyTag>) {
	const companyTag: CompanyTag = {
		id: randomUUID(),
		name: `company-tag-${Date.now()}`,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		...override,
	};

	return companyTag;
}
