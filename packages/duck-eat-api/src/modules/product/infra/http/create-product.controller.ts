import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
  createProductRequestDto,
  createProductResponse,
} from "../../application/dto/create-product.dto";
import { CreateProductUseCase } from "../../application/use-cases/create-product.use-case";
import { PrismaProductRepository } from "../db/prisma-product-repository";

export const createProductController: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/new",
    {
      schema: {
        summary: "Create Product",
        description: "API for create product",
        body: createProductRequestDto,
        tags: ["Products", "Organization", "Authenticated"],
        response: {
          201: createProductResponse,
        },
      },
    },
    async (request, reply) => {
      const { organizationId } = request.user;
      const { name, price, description } = request.body;

      const createProductUseCase = new CreateProductUseCase(
        new PrismaProductRepository(),
      );

      const response = await createProductUseCase.execute({
        name,
        price,
        description,
        organizationId,
      });

      return reply.status(201).send(response);
    },
  );
};
