import type { Company } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { CreateCompanyDto } from "../../application/dto/create-company.dto";
import type { CompanyRepository } from "../../domain/repositories/company-repository";

export class PrismaCompanyRepository implements CompanyRepository {
	async create(props: CreateCompanyDto): Promise<{ companyId: string }> {
        const newCompany = await prisma.company.create({
            data: {
                cnpj: props.cnpj,
                tradeName: props.tradeName,
                ownerId: props.ownerId
            }
        });

        return {
            companyId: newCompany.id
        }
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

    async getCompanyByOwnerId(ownerId: string): Promise<Company | null> {
        const company = await prisma.company.findFirst({
            where: {
                ownerId,
                deletedAt: null
            }
        });

        if(!company){
            return null;
        }

        return company;
    }
}
