import type {
	CompanySession,
	CompanySessionProduct,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { CreateCompanySession } from "../../application/dto/create-company-session.dto";
import type { ListCompanySession } from "../../application/dto/list-company-session.dto";
import type {
	CompanySessionRepository,
	CreateCompanyProductInput,
} from "../../domain/repositories/company-session.repository";

export class PrismaCompanySessionRepository
	implements CompanySessionRepository
{
	async create(props: CreateCompanySession): Promise<{ id: string }> {
		const newCompanySession = await prisma.companySession.create({
			data: {
				name: props.name,
				companyId: props.companyId,
			},
			select: {
				id: true,
			},
		});

		return {
			id: newCompanySession.id,
		};
	}

	async listByOrganization(
		organizationId: string,
	): Promise<ListCompanySession> {
		const response = await prisma.companySession.findMany({
			where: {
				deletedAt: null,
				company: {
					organizationId,
				},
			},
			select: {
				id: true,
				name: true,
				company: {
					select: {
						id: true,
						tradeName: true,
					},
				},
			},
		});

		return response;
	}

	async addProducts(props: CreateCompanyProductInput): Promise<void> {
		await prisma.companySessionProduct.createMany({
			data: props.productIds.map((productId) => {
				return {
					productId,
					companySessionId: props.companySessionId,
				};
			}),
		});
	}

	async findById(companySessionId: string): Promise<CompanySession | null> {
		const companySession = await prisma.companySession.findFirst({
			where: {
				id: companySessionId,
				deletedAt: null,
			},
		});

		if (!companySession) {
			return null;
		}

		return companySession;
	}

	async removeAllCompanySessionProduct(
		companySessionId: string,
	): Promise<void> {
		await prisma.companySessionProduct.deleteMany({
			where: {
				companySessionId,
			},
		});
	}
}
