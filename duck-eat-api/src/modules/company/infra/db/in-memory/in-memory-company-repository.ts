import { randomUUID } from "node:crypto";
import type { Company, CompanyAbout, CompanyTag } from "@/generated/prisma/client";
import type { CreateCompanyDto } from "@/modules/company/application/dto/create-company.dto";
import type { CompanyRepository } from "@/modules/company/domain/repositories/company-repository";
import { GetMyCompany } from "@/modules/company/application/dto/get-my-company.dto";
// import { CreateCompanyDto } from "@/modules/company/application/dto/create-company.dto";

export class InMemoryCompanyRepository implements CompanyRepository {
	companies: Company[] = [];
    companyAbout: CompanyAbout[] = [];
	companyTag: CompanyTag[] = [];

	async create(props: CreateCompanyDto): Promise<{ companyId: string }> {
		const companyId = randomUUID();
		// const companyTag = this.companyTag.find((element => element.id === props.companyTagId));

		this.companies.push({
			id: companyId,
			cnpj: props.cnpj,
			ownerId: props.ownerId,
			tradeName: props.tradeName,
			createdAt: new Date(),
			deletedAt: new Date(),
			updatedAt: new Date(),
			companyTagId: props.companyTagId,
			companyAboutId: null,
		});

        this.companyAbout.push({
            id: randomUUID(),
            description: props.companyAbout.description,
            address: props.companyAbout.address,
            companyId: companyId,
            createdAt: new Date(),
            updatedAt: new Date(),
            deleteAt: null,
        })

		return {
			companyId,
		};
	}

	async findByCnpj(cnpj: string): Promise<Company | null> {
		const searchCompany = this.companies.find(
			(element) => element.cnpj === cnpj,
		);

		if (!searchCompany) {
			return null;
		}

		return searchCompany;
	}

	async getCompanyByOwnerId(ownerId: string): Promise<GetMyCompany | null> {
		const searchCompany = this.companies.find(
			(element) => element.ownerId === ownerId,
		);

		if (!searchCompany) {
			return null;
		};

		const companyTag = this.companyTag.find((element => element.id === searchCompany.companyTagId)) as CompanyTag;

		return {
			...searchCompany,
			companyTag: {
				id: companyTag.id,
				name: companyTag.name
			}
		};
	}
}
