import { ResourceConflictError } from "@/errors/resource-conflict.error";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import type { CompanyRepository } from "../../domain/repositories/company-repository";
import type { CompanyTagRepository } from "../../domain/repositories/company-tag-repository";
import type { CreateCompanyDto } from "../dto/create-company.dto";

export class CreateCompanyUseCase {
	constructor(
		private readonly companyRepository: CompanyRepository,
		private readonly companyTagRepository: CompanyTagRepository,
	) {}

	async execute(props: CreateCompanyDto) {
		const verifyCompanyExisting = await this.companyRepository.findByCnpj(
			props.cnpj,
		);

		if (verifyCompanyExisting) {
			throw new ResourceConflictError("Company already create");
		}

		const searchCompanyTag = await this.companyTagRepository.findById(
			props.companyTagId,
		);

		if (!searchCompanyTag) {
			throw new ResourceNotFoundError("Company tag not found");
		}

		const companyNew = await this.companyRepository.create({
			cnpj: props.cnpj,
			organizationId: props.organizationId,
			tradeName: props.tradeName,
			companyTagId: searchCompanyTag.id,
			companyAbout: props.companyAbout,
		});

		return {
			companyId: companyNew.companyId,
		};
	}
}
