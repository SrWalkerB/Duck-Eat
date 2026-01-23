import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
	createProductRequestDto,
	createProductResponse,
} from "../../application/dto/create-product.dto";
import { CreateProductUseCase } from "../../application/use-cases/create-product.use-case";
import { PrismaProductRepository } from "../db/prisma-product-repository";
import { PrismaCompanyRepository } from "@/modules/company/infra/db/prisma-company-repository";

export const createProductController: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/",
		{
			schema: {
				summary: "Create Product",
				description: "API for create product",
				body: createProductRequestDto,
				response: {
					201: createProductResponse,
				},
			},
		},
		async (request, reply) => {
			const { userId } = request.user;
			const { name, price, description } = request.body;

			const createProductUseCase = new CreateProductUseCase(
				new PrismaCompanyRepository(),
				new PrismaProductRepository(),
			);

			const response = await createProductUseCase.execute({
				name,
				price,
				description,
				userLoggedId: userId,
			});

			return reply.status(201).send(response);
		},
	);
};
