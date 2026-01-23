import type { CompanyTag } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { CompanyTagRepository } from "../../domain/repositories/company-tag-repository";

export class PrismaCompanyTagRepository implements CompanyTagRepository {
	async listAll(): Promise<CompanyTag[]> {
		return await prisma.companyTag.findMany({
			where: {
				deletedAt: null,
			},
		});
	}

	async findById(id: string): Promise<CompanyTag | null> {
		return await prisma.companyTag.findFirst({
			where: {
				id,
				deletedAt: null,
			},
		});
	}
}
