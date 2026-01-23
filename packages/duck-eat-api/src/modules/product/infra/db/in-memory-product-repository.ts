import { randomUUID } from "node:crypto";
import { CompanyProduct } from "@/generated/prisma/client";
import {
	CreateProductEntity,
	ProductRepository,
} from "../../domain/repositories/product-repository";

export class InMemoryProductRepository implements ProductRepository {
	products: CompanyProduct[] = [];

	async create(props: CreateProductEntity): Promise<{ id: string }> {
		const productNew: CompanyProduct = {
			id: randomUUID(),
			companyId: props.companyId,
			name: props.name,
			price: props.price,
			description: props.description,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		};

		this.products.push(productNew);

		return {
			id: productNew.id,
		};
	}
}
