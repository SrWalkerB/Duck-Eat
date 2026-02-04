import { describe, test, expect, beforeEach } from "vitest";
import { CreateProductUseCase } from "./create-product.use-case";
import { InMemoryCompanyRepository } from "@/test/repositories/in-memory-company-repository";
import { makeProduct } from "@/test/factories/make-product";
import { makeCompany } from "@/test/factories/make-company";
import { makeUser } from "@/test/factories/make-user";
import { makeCompanyTag } from "@/test/factories/make-company-tag";
import { InMemoryProductRepository } from "@/test/repositories/in-memory-product-repository";

let inMemoryCompanyRepository: InMemoryCompanyRepository;
let inMemoryProductRepository: InMemoryProductRepository;
let sut: CreateProductUseCase;

describe("Create Product", () => {
	beforeEach(() => {
		inMemoryCompanyRepository = new InMemoryCompanyRepository();
		inMemoryProductRepository = new InMemoryProductRepository();
		sut = new CreateProductUseCase(inMemoryProductRepository);
	});

	test("should create product for company owner by the user", async () => {
		const userMock = makeUser();
		const companyTag = makeCompanyTag();
		const companyMock = makeCompany({
			companyTagId: companyTag.id,
		});

		const productMock = makeProduct();

		inMemoryCompanyRepository.companiesTag.push(companyTag);
		inMemoryCompanyRepository.companies.push(companyMock);
		inMemoryProductRepository.products.push(productMock);

		const response = await sut.execute({
			name: productMock.name,
			description: productMock.description,
			price: productMock.price,
			organizationId: productMock.organizationId,
		});

		expect(response).toEqual({
			id: expect.any(String),
		});
	});
});
