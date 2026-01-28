import type { Organization } from "@/generated/prisma/client";

export interface CreateOrganizationEntity {
	name: string;
	slug: string;
	ownerId: string;
}

export interface OrganizationRepository {
	create(props: CreateOrganizationEntity): Promise<{ id: string }>;
	// findById(organizationId: string): Promise<Organization | null>;
	// findBySlug(slug: string): Promise<Organization | null>;
	addMember(userId: string, organizationId: string): Promise<{ id: string }>;
	findOrganizationByUserId(userId: string): Promise<Organization | null>;
}
