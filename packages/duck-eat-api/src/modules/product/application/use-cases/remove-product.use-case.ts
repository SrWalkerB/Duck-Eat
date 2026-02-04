import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { ProductRepository } from "../../domain/repositories/product-repository";

export class RemoveProductUseCase {
	constructor(private readonly productRepository: ProductRepository) {}

	async execute(productId: string, organizationId: string) {
		const searchProduct = await this.productRepository.findOne(
			productId,
			organizationId,
		);

		if (!searchProduct) {
			throw new ResourceNotFoundError("Product", "not found");
		}

		await this.productRepository.removeById(searchProduct.id);
	}
}
