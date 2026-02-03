import type { CompanySession } from "@/generated/prisma/client";
import type { CreateCompanySession } from "../../application/dto/create-company-session.dto";
import type { ListCompanySession } from "../../application/dto/list-company-session.dto";

export interface CreateCompanyProductEntity {
  companySessionId: string;
  productIds: string[];
}

export interface CompanySessionRepository {
  create(props: CreateCompanySession): Promise<{ id: string }>;
  listByOrganization(organizationId: string): Promise<ListCompanySession>;
  addProducts(props: CreateCompanyProductEntity): Promise<void>;
  findById(companySessionId: string): Promise<CompanySession | null>;
}
