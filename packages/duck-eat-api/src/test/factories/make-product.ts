import { Product } from "@/generated/prisma/client";
import { randomUUID } from "node:crypto";

export function makeProduct(override?: Partial<Product>) {
	const productMock: Product = {
		id: randomUUID(),
		name: `product-${Date.now()}`,
		price: 1,
		organizationId: randomUUID(),
		description: `description`,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		...override,
	};

	return productMock;
}
