import { ProductRepository } from "../../domain/repositories/product-repository";

export class ListProductsUseCase {
	constructor(private readonly productRepository: ProductRepository) {}

	async execute(ownerId: string) {
		const response =
			await this.productRepository.listProductsByOwnerId(ownerId);

		return response;
	}
}
