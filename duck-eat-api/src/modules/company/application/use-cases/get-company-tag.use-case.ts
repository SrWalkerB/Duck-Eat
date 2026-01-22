import type { CompanyTagRepository } from "../../domain/repositories/company-tag-repository";
import { getCompanyTagDto } from "../dto/get-company-tag.dto";

export class GetCompanyTagUseCase {
	constructor(private readonly companyTagRepository: CompanyTagRepository) {}

	async execute() {
		const response = await this.companyTagRepository.listAll();

		return getCompanyTagDto.parse(response);
	}
}
