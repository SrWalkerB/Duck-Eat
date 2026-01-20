import { ResourceConflictError } from "@/errors/resource-conflict.error";
import type { CompanyRepository } from "../../domain/repositories/company-repository";
import type { CreateCompanyDto } from "../dto/create-company.dto";

export class CreateCompanyUseCase {
	constructor(private readonly companyRepository: CompanyRepository) {}

	async execute(props: CreateCompanyDto) {
		const verifyCompanyExisting = await this.companyRepository.findByCnpj(
			props.cnpj,
		);

		if (verifyCompanyExisting) {
			throw new ResourceConflictError("Company already create");
		}

        const companyNew = await this.companyRepository.create({
            cnpj: props.cnpj,
            ownerId: props.ownerId,
            tradeName: props.tradeName
        })

		return {
            companyId: companyNew.companyId
        };
	}
}
