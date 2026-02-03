import { expect, test, describe, beforeEach } from "vitest";
import { ListProductsUseCase } from "./list-products.use-case";
import { InMemoryProductRepository } from "@/test/repositories/in-memory-product-repository";
import { makeProduct } from "@/test/factories/make-product";
import { makeOrganization } from "@/test/factories/make-organization";
import { FakeUploadFile } from "@/lib/storage/fake-upload-file";

let inMemoryProductRepository: InMemoryProductRepository;
let fakeUploadFile: FakeUploadFile;
let sut: ListProductsUseCase;

describe("List Products", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository();
    fakeUploadFile = new FakeUploadFile();
    sut = new ListProductsUseCase(fakeUploadFile, inMemoryProductRepository);
  });

  test("should return list products by organizationId", async () => {
    const organizationMock = makeOrganization();
    const productMock = makeProduct({
      organizationId: organizationMock.id,
    });

    inMemoryProductRepository.products.push(productMock);

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
