import { randomUUID } from "node:crypto";
import {
	CreateProductEntity,
	ListProductData,
	ProductRepository,
} from "../../domain/repositories/product-repository";
import { ListProduct } from "../../application/dto/list-product.dto";
import { Product, ProductPhotos } from "@/generated/prisma/client";

export class InMemoryProductRepository implements ProductRepository {
	products: Product[] = [];
	productPhotos: ProductPhotos[] = [];

	async create(props: CreateProductEntity): Promise<{ id: string }> {
		const productNew: Product = {
			id: randomUUID(),
			name: props.name,
			price: props.price,
			description: props.description,
			organizationId: props.organizationId,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		};

		this.products.push(productNew);

		return {
			id: productNew.id,
		};
	}

	async listProducts(organizationId: string): Promise<ListProductData[]> {
		return this.products
			.filter(
				(element) =>
					element.organizationId === organizationId && !element.deletedAt,
			)
			.map((product) => {
				const productsPhotos = this.productPhotos.filter(
					(element) => element.productId === product.id,
				);

				return {
					id: product.id,
					name: product.name,
					description: product.description,
					price: product.price,
					productPhotos: productsPhotos.map((photo) => {
						return {
							photoUrlKey: photo.photoUrlKey,
						};
					}),
				};
			});
	}

	async findOne(
		productId: string,
		organizationId: string,
	): Promise<Product | null> {
		const searchProduct = this.products.find(
			(element) =>
				element.id === productId &&
				element.organizationId === organizationId &&
				!element.deletedAt,
		);

		return searchProduct ? searchProduct : null;
	}

	async removeById(productId: string): Promise<void> {
		this.products = this.products.filter((element) => element.id !== productId);
	}

	async addPhoto(productKey: string, productId: string): Promise<void> {
		this.productPhotos.push({
			id: randomUUID(),
			productId,
			photoUrlKey: productKey,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		});
	}
}
