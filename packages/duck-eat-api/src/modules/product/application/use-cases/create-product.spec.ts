import { describe, test, expect } from "vitest";
import { CreateProductUseCase } from "./create-product.use-case";
import { InMemoryCompanyRepository } from "@/modules/company/infra/db/in-memory/in-memory-company-repository";
import { InMemoryProductRepository } from "../../infra/db/in-memory-product-repository";
import { makeProduct } from "@/test/factories/make-product";
import { makeCompany } from "@/test/factories/make-company";
import { makeUser } from "@/test/factories/make-user";
import { makeCompanyTag } from "@/test/factories/make-company-tag";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";

describe("Create Product", () => {
	test("should create product for company owner by the user", async () => {
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const inMemoryProductRepository = new InMemoryProductRepository();

		const userMock = makeUser();
		const companyTag = makeCompanyTag();
		const companyMock = makeCompany({
			ownerId: userMock.id,
			companyTagId: companyTag.id,
		});

		const productMock = makeProduct();

		inMemoryCompanyRepository.companiesTag.push(companyTag);
		inMemoryCompanyRepository.companies.push(companyMock);
		inMemoryProductRepository.products.push(productMock);

		const sut = new CreateProductUseCase(
			inMemoryCompanyRepository,
			inMemoryProductRepository,
		);

		const response = await sut.execute({
			name: productMock.name,
			description: productMock.description,
			price: productMock.price,
			userLoggedId: userMock.id,
		});

		expect(response).toEqual({
			id: expect.any(String),
		});
	});

	test("should return error create product if onwer id incorrect", async () => {
		const inMemoryCompanyRepository = new InMemoryCompanyRepository();
		const inMemoryProductRepository = new InMemoryProductRepository();

		const userMock = makeUser();
		const companyTag = makeCompanyTag();
		const companyMock = makeCompany({
			companyTagId: companyTag.id,
		});

		const productMock = makeProduct();

		inMemoryCompanyRepository.companiesTag.push(companyTag);
		inMemoryCompanyRepository.companies.push(companyMock);
		inMemoryProductRepository.products.push(productMock);

		const sut = new CreateProductUseCase(
			inMemoryCompanyRepository,
			inMemoryProductRepository,
		);

		await expect(
			sut.execute({
				name: productMock.name,
				description: productMock.description,
				price: productMock.price,
				userLoggedId: userMock.id,
			}),
		).rejects.toThrow(ResourceNotFoundError);
	});
});
