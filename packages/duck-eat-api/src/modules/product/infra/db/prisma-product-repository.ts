import type { CompanyProduct } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type {
	CreateProductEntity,
	ProductRepository,
} from "../../domain/repositories/product-repository";

export class PrismaProductRepository implements ProductRepository {
	async listProductsByOwnerId(ownerId: string): Promise<CompanyProduct[]> {
		return []
	}
	async create(props: CreateProductEntity): Promise<{ id: string }> {
		const productNew = await prisma.companyProduct.create({
			data: {
				name: props.name,
				companyId: props.companyId,
				price: props.price,
			},
			select: {
				id: true,
			},
		});

		return {
			id: productNew.id,
		};
	}

	async listProducts(): Promise<CompanyProduct[]> {
		return await prisma.companyProduct.findMany({
			where: {
				deletedAt: null,
			},
		});
	}
}
