import type { Organization } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type {
	CreateOrganizationEntity,
	OrganizationRepository,
} from "../../domain/repositories/organization.repository";

export class PrismaOrganizationRepository implements OrganizationRepository {
	async create(props: CreateOrganizationEntity): Promise<{ id: string }> {
		const organizationNew = await prisma.organization.create({
			data: {
				ownerId: props.ownerId,
				slug: props.slug,
				name: props.name,
			},
			select: {
				id: true,
			},
		});

		return {
			id: organizationNew.id,
		};
	}

	async findById(organizationId: string): Promise<Organization | null> {
		const searchOrganization = await prisma.organization.findFirst({
			where: {
				id: organizationId,
				deletedAt: null,
			},
		});

		return searchOrganization ?? null;
	}

	async findBySlug(slug: string): Promise<Organization | null> {
		const searchOrganization = await prisma.organization.findFirst({
			where: {
				slug: slug,
				deletedAt: null,
			},
		});

		return searchOrganization ?? null;
	}

	async addMember(
		userId: string,
		organizationId: string,
	): Promise<{ id: string }> {
		const organizationMember = await prisma.organizationMembers.create({
			data: {
				organizationId,
				userId,
			},
		});

		return {
			id: organizationMember.id,
		};
	}

	async findOrganizationByUserId(userId: string): Promise<Organization | null> {
		const searchOrganization = await prisma.organizationMembers.findFirst({
			where: {
				userId,
				deletedAt: null,
			},
			select: {
				organization: true,
			},
		});

		return searchOrganization ? searchOrganization.organization : null;
	}
}
