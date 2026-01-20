import type { Company } from "@/generated/prisma/client";
import type { CreateCompanyDto } from "../../application/dto/create-company.dto";

export interface CompanyRepository {
	create(props: CreateCompanyDto): Promise<{ companyId: string }>;
	findByCnpj(cnpj: string): Promise<Company | null>;
    getCompanyByOwnerId(ownerId: string): Promise<Company | null>
}
