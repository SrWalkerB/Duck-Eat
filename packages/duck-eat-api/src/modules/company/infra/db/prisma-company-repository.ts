import type { Company } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { CreateCompanyDto } from "../../application/dto/create-company.dto";
import type { GetMyCompany } from "../../application/dto/get-my-company.dto";
import type { CompanyRepository } from "../../domain/repositories/company-repository";

export class PrismaCompanyRepository implements CompanyRepository {
	async create(props: CreateCompanyDto): Promise<{ companyId: string }> {
		const newCompany = await prisma.company.create({
			data: {
				cnpj: props.cnpj,
				tradeName: props.tradeName,
				ownerId: props.ownerId,
				companyTagId: props.companyTagId,
			},
		});

		await prisma.companyAbout.create({
			data: {
				companyId: newCompany.id,
				address: props.companyAbout.address,
				description: props.companyAbout.description,
			},
		});

		return {
			companyId: newCompany.id,
		};
	}

	async findByCnpj(cnpj: string): Promise<Company | null> {
		const company = await prisma.company.findFirst({
			where: {
				cnpj,
				deletedAt: null,
			},
		});

		return company;
	}

	async getCompanyByOwnerId(ownerId: string): Promise<GetMyCompany | null> {
		const company = await prisma.company.findFirst({
			where: {
				ownerId,
				deletedAt: null,
			},
			select: {
				id: true,
				tradeName: true,
				cnpj: true,
				companyTag: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		if (!company) {
			return null;
		}

		return company;
	}
}
