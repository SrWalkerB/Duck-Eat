import { CompanyRepository } from "@/modules/company/domain/repositories/company-repository";
import { CreateProduct } from "../dto/create-product.dto";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { ProductRepository } from "../../domain/repositories/product-repository";

export class CreateProductUseCase {
	constructor(
		private readonly productRepository: ProductRepository,
	) {}

	async execute(props: CreateProduct) {
		const productNew = await this.productRepository.create({
			name: props.name,
			price: props.price,
			description: props.description,
			organizationId: props.organizationId
		});

		return {
			id: productNew.id,
		};
	}
}
