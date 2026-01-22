import { describe, expect, test } from "vitest";
import { ResourceConflictError } from "@/errors/resource-conflict.error";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { makeCompanyInput } from "@/test/factories/make-company";
import { makeCompanyTag } from "@/test/factories/make-company-tag";
import { InMemoryCompanyRepository } from "../../infra/db/in-memory/in-memory-company-repository";
import { InMemoryCompanyTagRepository } from "../../infra/db/in-memory/in-memory-company-tag-repository";
import { CreateCompanyUseCase } from "./create-company.use-case";

describe("Create Company", () => {
	test("should return success create company without duplicate cnpj", async () => {
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const inMemoryCompanyTagRepository = new InMemoryCompanyTagRepository();

		const companyTagMock = makeCompanyTag();

		inMemoryCompanyTagRepository.companyTags = [companyTagMock];

		const sut = new CreateCompanyUseCase(
			inMemoryCompanyRepository,
			inMemoryCompanyTagRepository,
		);
		const companyData = makeCompanyInput({
			companyTagId: companyTagMock.id
		});
		const companyNew = await sut.execute(companyData);

		expect(companyNew).toEqual({
			companyId: expect.any(String),
		});
	});

	test("should return error duplicate cnpj", async () => {
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const inMemoryCompanyTagRepository = new InMemoryCompanyTagRepository();

		const companyTagMock = makeCompanyTag();

		inMemoryCompanyTagRepository.companyTags = [companyTagMock];

		const sut = new CreateCompanyUseCase(
			inMemoryCompanyRepository,
			inMemoryCompanyTagRepository,
		);
		const companyOne = makeCompanyInput({
			cnpj: "12345678900",
			companyTagId: companyTagMock.id,
		});
		const companyTwo = makeCompanyInput({
			cnpj: "12345678900",
			companyTagId: companyTagMock.id,
		});

		await sut.execute(companyOne);

		await expect(sut.execute(companyTwo))
		.rejects
		.toThrow(
			ResourceConflictError,
		);
	});

	test("should return error company tag not found", async () => {
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const inMemoryCompanyTagRepository = new InMemoryCompanyTagRepository();
		const companyTagMock = makeCompanyTag();

		const sut = new CreateCompanyUseCase(
			inMemoryCompanyRepository,
			inMemoryCompanyTagRepository,
		);
		const companyMockData = makeCompanyInput({
			cnpj: "12345678900",
			companyTagId: companyTagMock.id,
		});

		await expect(sut.execute(companyMockData))
		.rejects
		.toThrow(
			ResourceNotFoundError,
		);
	});
});
