import { describe, expect, test } from "vitest";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { makeCompanyInput } from "@/test/factories/make-company";
import { InMemoryCompanyRepository } from "../../../../test/repositories/in-memory-company-repository";
import { GetMyCompanyUseCase } from "./get-my-company.use-case";
import { makeCompanyTag } from "@/test/factories/make-company-tag";
import { makeOrganization } from "@/test/factories/make-organization";

describe("Get my company", () => {
  test("should return my company", async () => {
    const inMemoryCompanyRepository = new InMemoryCompanyRepository();
    const companyTag = makeCompanyTag();
    const organizationMock = makeOrganization();
    const companyMock = makeCompanyInput({
      companyTagId: companyTag.id,
      organizationId: organizationMock.id
    });
    inMemoryCompanyRepository.companiesTag.push(companyTag);

    const sut = new GetMyCompanyUseCase(inMemoryCompanyRepository);

    await inMemoryCompanyRepository.create(companyMock);

    const companyNew = await sut.execute(companyMock.organizationId);

    expect(companyNew).toEqual([{
      id: expect.any(String),
      cnpj: expect.any(String),
      tradeName: expect.any(String),
      companyTag: {
        id: expect.any(String),
        name: expect.any(String),
      },
    }]);
  });

  test("should return error company not found", async () => {
    const inMemoryCompanyRepository = new InMemoryCompanyRepository();
    const sut = new GetMyCompanyUseCase(inMemoryCompanyRepository);
    const companyMock = makeCompanyInput();

    await expect(sut.execute(companyMock.organizationId))
      .rejects
      .toThrow(ResourceNotFoundError);
  });
});
