import { randomUUID } from "node:crypto";
import type { CreateCompanyDto } from "@/modules/company/application/dto/create-company.dto";
import { Company } from "@/generated/prisma/client";

export function makeCompanyInput(override?: Partial<CreateCompanyDto>) {
	const companyInputMock: CreateCompanyDto = {
		cnpj: "11111111111111",
		tradeName: "Client 1",
		organizationId: randomUUID(),
		companyTagId: randomUUID(),
		companyAbout: {
			address: "rua test",
			description: "test",
		},
		...override,
	};

	return companyInputMock;
}

export function makeCompany(override?: Partial<Company>) {
	const companyMock: Company = {
		id: randomUUID(),
		cnpj: "11111111111111",
		tradeName: `client-${Date.now()}`,
		organizationId: randomUUID(),
		companyTagId: randomUUID(),
		companyAboutId: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		...override,
	};

	return companyMock;
}
