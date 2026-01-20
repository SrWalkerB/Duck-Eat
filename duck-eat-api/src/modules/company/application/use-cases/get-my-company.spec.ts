import { describe, expect, test } from "vitest";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { makeCompany } from "@/test/factories/make-company";
import { InMemoryCompanyRepository } from "../../infra/db/in-memory/in-memory-company-repository";
import { GetMyCompanyUseCase } from "./get-my-company.use-case";

describe("Get my company", () => {
	test("should return my company", async () => {
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const sut = new GetMyCompanyUseCase(inMemoryCompanyRepository);
		const companyMock = makeCompany();

		await inMemoryCompanyRepository.create(companyMock);

		const companyNew = await sut.execute(companyMock.ownerId);

		expect(companyNew).toEqual({
			id: expect.any(String),
			cnpj: expect.any(String),
			tradeName: expect.any(String),
		});
	});

	test("should return error company not found", async () => {
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const sut = new GetMyCompanyUseCase(inMemoryCompanyRepository);
		const companyMock = makeCompany();

		await expect(sut.execute(companyMock.ownerId))
        .rejects
        .toThrow(
			ResourceNotFoundError,
		);
	});
});
