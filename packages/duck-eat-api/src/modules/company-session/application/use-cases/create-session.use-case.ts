import type { CompanySessionRepository } from "../../domain/repositories/company-session.repository";
import {
	type CreateCompanySession,
	createCompanySessionResponseDto,
} from "../dto/create-company-session.dto";

export class CreateSessionUseCase {
	constructor(
		private readonly companySessionRepository: CompanySessionRepository,
	) {}

	async execute(props: CreateCompanySession) {
		const response = await this.companySessionRepository.create({
			companyId: props.companyId,
			organizationId: props.organizationId,
			name: props.name,
		});

		return createCompanySessionResponseDto.parse({
			id: response.id,
		});
	}
}
