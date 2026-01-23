import type { CompanyTag } from "@/generated/prisma/client";
import type { CompanyTagRepository } from "@/modules/company/domain/repositories/company-tag-repository";

export class InMemoryCompanyTagRepository implements CompanyTagRepository {
	companyTags: CompanyTag[] = [];

	async listAll(): Promise<CompanyTag[]> {
		return this.companyTags;
	}

	async findById(id: string): Promise<CompanyTag | null> {
		const searchCompanyTag = this.companyTags.find(
			(element) => element.id === id && !element.deletedAt,
		);

		if (!searchCompanyTag) {
			return null;
		}

		return searchCompanyTag;
	}
}
