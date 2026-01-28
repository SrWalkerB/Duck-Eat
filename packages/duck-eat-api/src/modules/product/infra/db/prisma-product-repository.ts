import { prisma } from "@/lib/db/prisma";
import type {
	CreateProductEntity,
	ProductRepository,
} from "../../domain/repositories/product-repository";
import { ListProduct } from "../../application/dto/list-product.dto";
import { Product } from "@/generated/prisma/client";

export class PrismaProductRepository implements ProductRepository {
	async create(props: CreateProductEntity): Promise<{ id: string }> {
		const productNew = await prisma.product.create({
			data: {
				name: props.name,
				price: props.price,
				organizationId: props.organizationId
			},
			select: {
				id: true,
			},
		});

		return {
			id: productNew.id,
		};
	}

	async listProducts(organizationId: string): Promise<ListProduct> {
		return await prisma.product.findMany({
			where: {
				organizationId,
				deletedAt: null
			},
			select: {
				id: true,
				name: true,
				description: true,
				price: true
			}
		})
	}

	async findOne(productId: string, organizationId: string): Promise<Product | null> {
		return await prisma.product.findFirst({
			where: {
				id: productId,
				organizationId: organizationId,
				deletedAt: null
			},
		});
	}

	async removeById(productId: string): Promise<void> {
		await prisma.product.update({
			where: {
				id: productId
			},
			data: {
				deletedAt: new Date()
			},
		});
	}
}
