import { CompanyRepository } from "@/modules/company/domain/repositories/company-repository";
import { CreateProduct } from "../dto/create-product.dto";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { ProductRepository } from "../../domain/repositories/product-repository";

export class CreateProductUseCase {
	constructor(
		private readonly companyRepository: CompanyRepository,
		private readonly productRepository: ProductRepository,
	) {}

	async execute(props: CreateProduct) {
		const myCompany = await this.companyRepository.getCompanyByOwnerId(
			props.userLoggedId,
		);

		console.log(myCompany, props);
		if (!myCompany) {
			throw new ResourceNotFoundError("Company", "Company not found");
		}

		const productNew = await this.productRepository.create({
			name: props.name,
			companyId: myCompany.id,
			price: props.price,
			description: props.description,
		});

		return {
			id: productNew.id,
		};
	}
}
