import { describe, expect, test, beforeEach } from "vitest";
import { makeCompanyTag } from "@/test/factories/make-company-tag";
import { InMemoryCompanyTagRepository } from "@/test/repositories/in-memory-company-tag-repository";
import { GetCompanyTagUseCase } from "./get-company-tag.use-case";

let inMemoryCompanyTagRepository: InMemoryCompanyTagRepository;
let sut: GetCompanyTagUseCase;

describe("Get Company Tag", () => {
	beforeEach(() => {
		inMemoryCompanyTagRepository = new InMemoryCompanyTagRepository();
		sut = new GetCompanyTagUseCase(inMemoryCompanyTagRepository);
	});

	test("should return company tag list", async () => {
		const companyTagMock = makeCompanyTag();
		inMemoryCompanyTagRepository.companyTags = [companyTagMock];

		const response = await sut.execute();

		expect(response).toEqual([
			{
				id: expect.any(String),
				name: expect.any(String),
			},
		]);
	});
});
