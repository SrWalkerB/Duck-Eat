import { CompanySessionRepository } from "../../domain/repositories/company-session.repository";
import {
  CreateSession,
  createSessionResponseDto,
} from "../dto/create-session.dto";

export class CreateSessionUseCase {
  constructor(
    private readonly companySessionRepository: CompanySessionRepository,
  ) {}

  async execute(props: CreateSession) {
    const response = await this.companySessionRepository.create({
      companyId: props.companyId,
      organizationId: props.organizationId,
      name: props.name,
    });

    return createSessionResponseDto.parse({
      id: response.id,
    });
  }
}
