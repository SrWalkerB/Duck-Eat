import { randomUUID } from "node:crypto";
import type { Company } from "@/generated/prisma/client";

export function makeCompany(override?: Partial<Company>) {
	const companyMock: Company = {
		id: randomUUID(),
		cnpj: "11111111111111",
		tradeName: "Client 1",
		ownerId: randomUUID(),
		createdAt: new Date(),
		deletedAt: new Date(),
		updatedAt: new Date(),
		...override,
	};

    return companyMock;
}
