import { CreateSession } from "../../application/dto/create-session.dto";

export interface CompanySessionRepository {
  create(props: CreateSession): Promise<{ id: string }>;
}
