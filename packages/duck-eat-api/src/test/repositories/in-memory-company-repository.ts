import { randomUUID } from "node:crypto";
import type {
	Company,
	CompanyAbout,
	CompanyTag,
} from "@/generated/prisma/client";
import type { CreateCompanyDto } from "@/modules/company/application/dto/create-company.dto";
import type { GetMyCompanies } from "@/modules/company/application/dto/get-my-company.dto";
import type { CompanyRepository } from "@/modules/company/domain/repositories/company-repository";

export class InMemoryCompanyRepository implements CompanyRepository {
	companies: Company[] = [];
	companiesAbout: CompanyAbout[] = [];
	companiesTag: CompanyTag[] = [];
	
	async getCompaniesByOrganizationId(organizationId: string): Promise<GetMyCompanies> {
		const searchCompanies = this.companies.filter((element => element.organizationId === organizationId));

		if(searchCompanies){
			return searchCompanies.map((company) => {
				const searchCompanyTag = this.companiesTag.find((element => element.id === company.companyTagId));

				return {
					id: company.id,
					cnpj: company.cnpj,
					tradeName: company.tradeName,
					companyTag: {
						id: searchCompanyTag!.id,
						name: searchCompanyTag!.name
					}
				}
			})
		}

		return []
	}

	async create(props: CreateCompanyDto): Promise<{ companyId: string }> {
		const companyId = randomUUID();

		this.companies.push({
			id: companyId,
			cnpj: props.cnpj,
			organizationId: props.organizationId,
			tradeName: props.tradeName,
			createdAt: new Date(),
			deletedAt: new Date(),
			updatedAt: new Date(),
			companyTagId: props.companyTagId,
			companyAboutId: null,
		});

		this.companiesAbout.push({
			id: randomUUID(),
			description: props.companyAbout.description,
			address: props.companyAbout.address,
			companyId: companyId,
			createdAt: new Date(),
			updatedAt: new Date(),
			deleteAt: null,
		});

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
}
