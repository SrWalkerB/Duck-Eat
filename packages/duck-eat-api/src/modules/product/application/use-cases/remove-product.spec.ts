import { expect, describe, test, beforeEach } from "vitest";
import { RemoveProductUseCase } from "./remove-product.use-case";
import { makeProduct } from "@/test/factories/make-product";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { InMemoryProductRepository } from "@/test/repositories/in-memory-product-repository";

let inMemoryProductRepository: InMemoryProductRepository;
let sut: RemoveProductUseCase;

describe("Remove Product", () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository();
    sut = new RemoveProductUseCase(inMemoryProductRepository);
  });

  test("should remove product by productId and organizationId", async () => {
    const productMock = makeProduct();

    inMemoryProductRepository.products.push(productMock);

    const response = await sut.execute(productMock.id, productMock.organizationId);

    expect(response).toBeFalsy()
  });

  test("should return not found product if no exists productId valid", async () => {
    const productMock = makeProduct();

    expect(sut.execute(productMock.id, productMock.organizationId))
      .rejects
      .toThrowError(ResourceNotFoundError)
  })
})