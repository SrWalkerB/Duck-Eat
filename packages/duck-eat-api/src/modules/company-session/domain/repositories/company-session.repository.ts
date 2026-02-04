import type {
	CompanySession,
	CompanySessionProduct,
} from "@/generated/prisma/client";
import type { CreateCompanySession } from "../../application/dto/create-company-session.dto";
import type { ListCompanySession } from "../../application/dto/list-company-session.dto";

export interface CreateCompanyProductInput {
	companySessionId: string;
	productIds: string[];
}

export interface CompanySessionRepository {
	create(props: CreateCompanySession): Promise<{ id: string }>;
	listByOrganization(organizationId: string): Promise<ListCompanySession>;
	addProducts(props: CreateCompanyProductInput): Promise<void>;
	findById(companySessionId: string): Promise<CompanySession | null>;
	removeAllCompanySessionProduct(companySessionId: string): Promise<void>;
}
