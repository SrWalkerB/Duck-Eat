import type { CompanySessionRepository } from "../../domain/repositories/company-session.repository";
import { listCompanySessionDto } from "../dto/list-company-session.dto";

export class ListCompanySessionUseCase {
  constructor(
    private readonly companySessionRepository: CompanySessionRepository,
  ) {}

  async execute(organizationId: string) {
    const response =
      await this.companySessionRepository.listByOrganization(organizationId);

    return listCompanySessionDto.parse(response);
  }
}
