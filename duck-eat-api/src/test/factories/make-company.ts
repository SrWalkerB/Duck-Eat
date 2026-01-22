import { randomUUID } from "node:crypto";
import type { CreateCompanyDto } from "@/modules/company/application/dto/create-company.dto";

export function makeCompanyInput(override?: Partial<CreateCompanyDto>) {
	const companyInputMock: CreateCompanyDto = {
		cnpj: "11111111111111",
		tradeName: "Client 1",
		ownerId: randomUUID(),
		companyTagId: randomUUID(),
		companyAbout: {
			address: "rua test",
			description: "test",
		},
		...override,
	};

	return companyInputMock;
}
