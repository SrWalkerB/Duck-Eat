import { randomUUID } from "node:crypto";
import type {
	Company,
	CompanySession,
	CompanySessionProduct,
} from "@/generated/prisma/client";
import type { CreateCompanySession } from "@/modules/company-session/application/dto/create-company-session.dto";
import type { ListCompanySession } from "@/modules/company-session/application/dto/list-company-session.dto";
import type {
	CompanySessionRepository,
	CreateCompanyProductInput,
} from "@/modules/company-session/domain/repositories/company-session.repository";

export class InMemoryCompanySessionRepository
	implements CompanySessionRepository
{
	companyList: Company[] = [];
	companySessionList: CompanySession[] = [];
	companySessionProductList: CompanySessionProduct[] = [];

	async listByOrganization(
		organizationId: string,
	): Promise<ListCompanySession> {
		const companies = this.companyList.filter(
			(element) => element.organizationId === organizationId,
		);

		if (!companies.length) {
			return [];
		}

		const companiesIds = companies.map((item) => {
			return item.id;
		});

		return this.companySessionList
			.filter((element) => companiesIds.includes(element.companyId))
			.map((item) => {
				const companySearch = companies.find(
					(element) => element.id === item.companyId,
				) as Company;

				return {
					id: item.id,
					name: item.name,
					company: {
						tradeName: companySearch.tradeName,
						id: item.companyId,
					},
				};
			});
	}

	async create(props: CreateCompanySession): Promise<{ id: string }> {
		const companySession: CompanySession = {
			id: randomUUID(),
			name: props.name,
			companyId: props.companyId,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		};

		this.companySessionList.push(companySession);

		return {
			id: companySession.id,
		};
	}

	async addProducts(props: CreateCompanyProductInput): Promise<void> {
		const companySessionProducts: CompanySessionProduct[] =
			props.productIds.map((productId) => {
				return {
					id: randomUUID(),
					companySessionId: props.companySessionId,
					productId: productId,
					createdAt: new Date(),
					updatedAt: new Date(),
					deletedAt: null,
				};
			});

		this.companySessionProductList.push(...companySessionProducts);
	}

	async findById(companySessionId: string): Promise<CompanySession | null> {
		const searchCompanySession = this.companySessionList.find(
			(element) => element.id === companySessionId,
		);

		if (!searchCompanySession) {
			return null;
		}

		return searchCompanySession;
	}

	async removeAllCompanySessionProduct(
		companySessionId: string,
	): Promise<void> {
		this.companySessionProductList = this.companySessionProductList.filter(
			(element) => element.companySessionId !== companySessionId,
		);
	}
}
