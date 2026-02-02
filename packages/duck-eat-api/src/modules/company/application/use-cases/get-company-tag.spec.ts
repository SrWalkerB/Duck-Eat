import { describe, expect, test } from "vitest";
import { makeCompanyTag } from "@/test/factories/make-company-tag";
import { InMemoryCompanyTagRepository } from "../../../../test/repositories/in-memory-company-tag-repository";
import { GetCompanyTagUseCase } from "./get-company-tag.use-case";

describe("Get Company Tag", () => {
  test("should return company tag list", async () => {
    const inMemoryCompanyTagRepository = new InMemoryCompanyTagRepository();
    const companyTagMock = makeCompanyTag();
    inMemoryCompanyTagRepository.companyTags = [companyTagMock];

    const sut = new GetCompanyTagUseCase(inMemoryCompanyTagRepository);

    const response = await sut.execute();

    expect(response).toEqual([
      {
        id: expect.any(String),
        name: expect.any(String),
      },
    ]);
  });
});
