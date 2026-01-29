import { expect, test, describe } from "vitest";
import { ListProductsUseCase } from "./list-products.use-case";
import { InMemoryProductRepository } from "../../infra/db/in-memory-product-repository";
import { makeProduct } from "@/test/factories/make-product";
import { makeOrganization } from "@/test/factories/make-organization";
import { FakeUploadFile } from "@/lib/storage/fake-upload-file";

describe("List Products", () => {
  test("should return list products by organizationId", async () => {
    const inMemoryProductRepository = new InMemoryProductRepository();
    const fakeUploadFile = new FakeUploadFile();
    const organizationMock = makeOrganization();
    const productMock = makeProduct({
      organizationId: organizationMock.id,
    });

    inMemoryProductRepository.products.push(productMock);

    const sut = new ListProductsUseCase(
      fakeUploadFile,
      inMemoryProductRepository,
    );
    const response = await sut.execute(organizationMock.id);

    expect(response[0]).toEqual({
      id: expect.any(String),
      description: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
      productPhotos: expect.any(Array),
    });
  });
});
