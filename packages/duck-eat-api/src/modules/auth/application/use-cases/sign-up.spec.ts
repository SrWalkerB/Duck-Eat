import { describe, expect, test, beforeEach } from "vitest";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account-repository";
import { InMemoryCompanyRepository } from "@/test/repositories/in-memory-company-repository";
import { InMemoryCompanyTagRepository } from "@/test/repositories/in-memory-company-tag-repository";
import { InMemoryOrganizationRepository } from "@/test/repositories/in-memory-organization.repository";
import { makeAccount } from "@/test/factories/make-account";
import { makeCompany, makeCompanyInput } from "@/test/factories/make-company";
import { makeCompanyTag } from "@/test/factories/make-company-tag";
import { makeUser } from "@/test/factories/make-user";
import { AccountAlreadyExistError } from "../error/account-already-exist.error";
import { SignUpUseCase } from "./sign-up.use-case";

let inMemoryAccountRepository: InMemoryAccountRepository;
let inMemoryCompanyRepository: InMemoryCompanyRepository;
let inMemoryCompanyTagRepository: InMemoryCompanyTagRepository;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let sut: SignUpUseCase;

describe("Sign Up", () => {
	beforeEach(() => {
		inMemoryAccountRepository = new InMemoryAccountRepository();
		inMemoryCompanyRepository = new InMemoryCompanyRepository();
		inMemoryCompanyTagRepository = new InMemoryCompanyTagRepository();
		inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
		sut = new SignUpUseCase(
			inMemoryAccountRepository,
			inMemoryCompanyRepository,
			inMemoryCompanyTagRepository,
			inMemoryOrganizationRepository,
		);
	});

	test("should create an account when email does not exist", async () => {
		const companyTag = makeCompanyTag();
		const companyData = makeCompany({
			companyTagId: companyTag.id,
		});

		inMemoryCompanyTagRepository.companyTags.push(companyTag);

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

		inMemoryAccountRepository.accounts = [accountMock];
		inMemoryAccountRepository.users = [userMock];

		await expect(
			sut.execute({
				account: {
					email: accountMock.email,
					name: userMock.name,
					password: accountMock.password,
					role: "RESTAURANT_ADMIN",
				},
				company: {
					cnpj: companyMock.cnpj,
					companyAbout: companyMock.companyAbout,
					companyTagId: companyMock.companyTagId,
					tradeName: companyMock.tradeName,
				},
			}),
		).rejects.toThrow(AccountAlreadyExistError);
	});
});
