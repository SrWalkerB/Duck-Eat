import { expect, describe, test } from "vitest";
import { InMemoryProductRepository } from "../../infra/db/in-memory-product-repository";
import { RemoveProductUseCase } from "./remove-product.use-case";
import { makeProduct } from "@/test/factories/make-product";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";

describe("Remove Product", () => {
    test("should remove product by productId and organizationId", async() => {
        const inMemoryProductRepository = new InMemoryProductRepository();
        const productMock = makeProduct();

        inMemoryProductRepository.products.push(productMock);
        const sut = new RemoveProductUseCase(inMemoryProductRepository);

        const response = await sut.execute(productMock.id, productMock.organizationId);

        expect(response).toBeFalsy()
    });

    test("should return not found product if no exists productId valid", async () => {
        const inMemoryProductRepository = new InMemoryProductRepository();
        const productMock = makeProduct();

        const sut = new RemoveProductUseCase(inMemoryProductRepository);

        expect(sut.execute(productMock.id, productMock.organizationId))
        .rejects
        .toThrowError(ResourceNotFoundError)
    })
})