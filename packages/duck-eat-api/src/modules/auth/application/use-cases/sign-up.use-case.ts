import { ResourceConflictError } from "@/errors/resource-conflict.error";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { Hashing } from "@/lib/hashing";
import type { AccountRepository } from "@/modules/account/domain/repositories/account-repository";
import type { CompanyRepository } from "@/modules/company/domain/repositories/company-repository";
import type { CompanyTagRepository } from "@/modules/company/domain/repositories/company-tag-repository";
import type { SignUpDto } from "../dto/sign-up.dto";
import { AccountAlreadyExistError } from "../error/account-already-exist.error";

export class SignUpUseCase {
	constructor(
		private readonly accountRepository: AccountRepository,
		private readonly companyRepository: CompanyRepository,
		private readonly companyTagRepository: CompanyTagRepository,
	) {}

	async execute(props: SignUpDto) {
		const accountExists = await this.accountRepository.getAccountByEmail(
			props.account.email,
		);

		if (accountExists) {
			throw new AccountAlreadyExistError("Account already exists");
		}

		if (props.account.role === "RESTAURANT_ADMIN") {
			const verifyCompanyExisting = await this.companyRepository.findByCnpj(
				props.company.cnpj,
			);

			if (verifyCompanyExisting) {
				throw new ResourceConflictError("Company already create");
			}

			const searchCompanyTag = await this.companyTagRepository.findById(
				props.company.companyTagId,
			);

			if (!searchCompanyTag) {
				throw new ResourceNotFoundError("Company tag", "Company tag not found");
			}
		}

		const passwordHash = await Hashing.hash(props.account.password);

		const userAccount = await this.accountRepository.createAccount({
			email: props.account.email,
			name: props.account.email,
			password: passwordHash,
			provider: "email",
			role: props.account.role,
		});

		if (props.account.role === "RESTAURANT_ADMIN") {
			await this.companyRepository.create({
				cnpj: props.company.cnpj,
				ownerId: userAccount.userId,
				tradeName: props.company.tradeName,
				companyTagId: props.company.companyTagId,
				companyAbout: props.company.companyAbout,
			});
		}

		return {
			userId: userAccount.userId,
		};
	}
}
