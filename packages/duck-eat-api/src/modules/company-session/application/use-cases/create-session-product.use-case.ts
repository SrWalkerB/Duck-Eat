import { NotAuthorization } from "@/errors/not-authorization.error";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import type { CompanyRepository } from "@/modules/company/domain/repositories/company-repository";
import type { ProductRepository } from "@/modules/product/domain/repositories/product-repository";
import type { CompanySessionRepository } from "../../domain/repositories/company-session.repository";
import type { CreateSessionProduct } from "../dto/create-company-session-product.dto";

export class CreateSessionProductUseCase {
	constructor(
		private readonly companySessionRepository: CompanySessionRepository,
		private readonly companyRepository: CompanyRepository,
		private readonly productRepository: ProductRepository,
	) {}

	async execute(props: CreateSessionProduct) {
		const [searchCompany, searchCompanySession] = await Promise.all([
			this.companyRepository.findById(props.companyId),
			this.companySessionRepository.findById(props.companySessionId),
		]);

		if (!searchCompany) {
			throw new ResourceNotFoundError("Company", "company not found");
		}

		if (!searchCompanySession) {
			throw new ResourceNotFoundError(
				"Company Session",
				"company session not found",
			);
		}

		if (searchCompany.organizationId !== props.organizationId) {
			throw new NotAuthorization();
		}

		await Promise.all(
			props.productIds.map(async (productId) => {
				const searchProduct = await this.productRepository.findOne(
					productId,
					props.organizationId,
				);

				if (!searchProduct) {
					throw new ResourceNotFoundError(
						`Product`,
						`productId: ${productId} not found`,
					);
				}
			}),
		);

		await this.companySessionRepository.removeAllCompanySessionProduct(
			props.companySessionId,
		);
		await this.companySessionRepository.addProducts({
			companySessionId: props.companySessionId,
			productIds: props.productIds,
		});

		console.log(props);
	}
}
