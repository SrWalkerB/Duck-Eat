import { describe, expect, test } from "vitest";
import { ResourceConflictError } from "@/errors/resource-conflict.error";
import { makeCompany } from "@/test/factories/make-company";
import { InMemoryCompanyRepository } from "../../infra/db/in-memory/in-memory-company-repository";
import { CreateCompanyUseCase } from "./create-company.use-case";

describe("Create Company", () => {
	test("should return success create company without duplicate cnpj", async () => {
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const sut = new CreateCompanyUseCase(inMemoryCompanyRepository);
		const companyData = makeCompany();
		const companyNew = await sut.execute({
			cnpj: companyData.cnpj,
			ownerId: companyData.ownerId,
			tradeName: companyData.tradeName,
		});

		expect(companyNew).toEqual({
			companyId: expect.any(String),
		});
	});

	test("should return error duplicate cnpj", async () => {
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const sut = new CreateCompanyUseCase(inMemoryCompanyRepository);
		const companyOne = makeCompany({
			cnpj: "12345678900",
		});
		const companyTwo = makeCompany({
			cnpj: "12345678900",
		});

		await sut.execute(companyOne);

		await expect(sut.execute(companyTwo))
        .rejects
        .toThrow(
			ResourceConflictError,
		);
	});
});
