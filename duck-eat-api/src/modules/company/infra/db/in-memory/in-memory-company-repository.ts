import { randomUUID } from "node:crypto";
import type { Company } from "@/generated/prisma/client";
import type { CreateCompanyDto } from "@/modules/company/application/dto/create-company.dto";
import type { CompanyRepository } from "@/modules/company/domain/repositories/company-repository";

export class InMemoryCompanyRepository implements CompanyRepository {
	companies: Company[] = [];

	async create(props: CreateCompanyDto): Promise<{ companyId: string }> {
        const companyId = randomUUID()

		this.companies.push({
			id: randomUUID(),
			cnpj: props.cnpj,
			ownerId: props.ownerId,
			tradeName: props.tradeName,
			createdAt: new Date(),
			deletedAt: new Date(),
			updatedAt: new Date(),
		});

        return {
            companyId
        }
	}

	async findByCnpj(cnpj: string): Promise<Company | null> {
        const searchCompany = this.companies.find((element => element.cnpj === cnpj));

        if(!searchCompany){
            return null;
        }

        return searchCompany;
    }

    async getCompanyByOwnerId(ownerId: string): Promise<Company | null> {
        const searchCompany = this.companies.find((element => element.ownerId === ownerId));

        if(!searchCompany){
            return null;
        }

        return searchCompany;
    }
}
