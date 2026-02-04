import type { Product } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type {
	CreateProductEntity,
	ListProductData,
	ProductRepository,
} from "../../domain/repositories/product-repository";

export class PrismaProductRepository implements ProductRepository {
	async create(props: CreateProductEntity): Promise<{ id: string }> {
		const productNew = await prisma.product.create({
			data: {
				name: props.name,
				price: props.price,
				organizationId: props.organizationId,
			},
			select: {
				id: true,
			},
		});

		return {
			id: productNew.id,
		};
	}

	async listProducts(organizationId: string): Promise<ListProductData[]> {
		return await prisma.product.findMany({
			where: {
				organizationId,
				deletedAt: null,
			},
			select: {
				id: true,
				name: true,
				description: true,
				price: true,
				companySessionProducts: {
					select: {
						companySession: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
				productPhotos: {
					where: {
						deletedAt: null,
					},
					select: {
						photoUrlKey: true,
					},
				},
			},
		});
	}

	async findOne(
		productId: string,
		organizationId: string,
	): Promise<Product | null> {
		return await prisma.product.findFirst({
			where: {
				id: productId,
				organizationId: organizationId,
				deletedAt: null,
			},
		});
	}

	async removeById(productId: string): Promise<void> {
		await prisma.product.update({
			where: {
				id: productId,
			},
			data: {
				deletedAt: new Date(),
			},
		});
	}

	async addPhoto(productKey: string, productId: string): Promise<void> {
		await prisma.productPhotos.create({
			data: {
				productId: productId,
				photoUrlKey: productKey,
			},
		});
	}
}
