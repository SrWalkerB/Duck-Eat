import { randomUUID } from "node:crypto";
import { CompanyProduct } from "@/generated/prisma/client";

export function makeProduct(override?: Partial<CompanyProduct>) {
	const productMock: CompanyProduct = {
		id: randomUUID(),
		name: `product-${Date.now()}`,
		price: 1,
		companyId: randomUUID(),
		description: `description`,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		...override,
	};

	return productMock;
}
