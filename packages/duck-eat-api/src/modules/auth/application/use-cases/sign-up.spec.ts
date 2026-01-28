import { describe, expect, test } from "vitest";
import { InMemoryAccountRepository } from "@/modules/account/infra/db/in-memory/in-memory-account-repository";
import { InMemoryCompanyRepository } from "@/modules/company/infra/db/in-memory/in-memory-company-repository";
import { InMemoryCompanyTagRepository } from "@/modules/company/infra/db/in-memory/in-memory-company-tag-repository";
import { InMemoryOrganizationRepository } from "@/modules/organization/infra/db/in-memory-organization.repository";
import { makeAccount } from "@/test/factories/make-account";
import { makeCompany, makeCompanyInput } from "@/test/factories/make-company";
import { makeCompanyTag } from "@/test/factories/make-company-tag";
import { makeUser } from "@/test/factories/make-user";
import { AccountAlreadyExistError } from "../error/account-already-exist.error";
import { SignUpUseCase } from "./sign-up.use-case";

describe("Sign Up", () => {
	test("should create an account when email does not exist", async () => {
		const inMemoryAccountRepository = new InMemoryAccountRepository();
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const inMemoryCompanyTagRepository = new InMemoryCompanyTagRepository();
		const inMemoryOrganizationRepository = new InMemoryOrganizationRepository();

		const companyTag = makeCompanyTag();
		const companyData = makeCompany({
			companyTagId: companyTag.id,
		});

		inMemoryCompanyTagRepository.companyTags.push(companyTag);

		const sut = new SignUpUseCase(
			inMemoryAccountRepository,
			inMemoryCompanyRepository,
			inMemoryCompanyTagRepository,
			inMemoryOrganizationRepository,
		);

		const response = await sut.execute({
			account: {
				email: "email@gmail.com",
				name: "Walker",
				password: "12345678",
				role: "RESTAURANT_ADMIN",
			},
			company: {
				cnpj: companyData.cnpj,
				tradeName: companyData.tradeName,
				companyTagId: companyData.companyTagId,
				companyAbout: {
					address: "Street 20",
					description: "",
				},
			},
		});

		expect(response).toEqual({
			userId: expect.any(String),
		});
	});

	test("should returning error to duplicate email", async () => {
		const accountMock = makeAccount();
		const userMock = makeUser({
			accountId: accountMock.id,
		});
		const companyMock = makeCompanyInput();

		const inMemoryAccountRepository = new InMemoryAccountRepository();
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const inMemoryCompanyTagRepository = new InMemoryCompanyTagRepository();
		const inMemoryOrganizationRepository = new InMemoryOrganizationRepository();

		inMemoryAccountRepository.accounts = [accountMock];
		inMemoryAccountRepository.users = [userMock];

		const sut = new SignUpUseCase(
			inMemoryAccountRepository,
			inMemoryCompanyRepository,
			inMemoryCompanyTagRepository,
			inMemoryOrganizationRepository
		);

		await expect(
			sut.execute({
				account: {
					email: accountMock.email,
					name:userMock.name,
					password: accountMock.password,
					role: "RESTAURANT_ADMIN"
				},
				company: {
					cnpj: companyMock.cnpj,
					companyAbout: companyMock.companyAbout,
					companyTagId: companyMock.companyTagId,
					tradeName: companyMock.tradeName
				}
			}),
		).rejects.toThrow(AccountAlreadyExistError);
	});
});
