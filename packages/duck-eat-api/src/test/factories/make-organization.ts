import { randomUUID } from "node:crypto";
import { Organization } from "@/generated/prisma/client";

export function makeOrganization(override?: Partial<Organization>) {
	const organizationMock: Organization = {
		id: randomUUID(),
		name: `org-${Date.now()}`,
		slug: `org-slug-${Date.now()}`,
		ownerId: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		...override,
	};

	return organizationMock;
}
