import { ProductRepository } from "../../domain/repositories/product-repository";

export class ListProductsUseCase {
	constructor(private readonly productRepository: ProductRepository) {}

	async execute(organizationId: string) {
		const response =
			await this.productRepository.listProducts(organizationId);

		return response;
	}
}
