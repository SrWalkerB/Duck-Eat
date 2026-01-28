import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import type { CompanyRepository } from "../../domain/repositories/company-repository";
import { getMyCompanyDto } from "../dto/get-my-company.dto";

export class GetMyCompanyUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	async execute(organizationId: string) {
		const searchCompany =
			await this.companyRepository.getCompaniesByOrganizationId(organizationId);

		if (!searchCompany.length) {
			throw new ResourceNotFoundError("Company not found");
		}

		return getMyCompanyDto.parse(searchCompany);
	}
}
