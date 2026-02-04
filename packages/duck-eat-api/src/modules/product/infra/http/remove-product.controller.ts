import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
	removeProductDto,
	removeProductResponse,
} from "../../application/dto/remove-product.dto";
import { RemoveProductUseCase } from "../../application/use-cases/remove-product.use-case";
import { PrismaProductRepository } from "../db/prisma-product-repository";
import { Can } from "@/http/plugins/can";

export const removeProductController: FastifyPluginAsyncZod = async (app) => {
	app.delete(
		":productId/remove",
		{
			schema: {
				summary: "Remove product of organization",
				description: "Remove product of organization by productId",
				params: removeProductDto,
				tags: ["Product", "Authenticated", "Organization"],
				response: {
					200: removeProductResponse,
				},
				preHandler: [Can.role(["ADMIN", "RESTAURANT_ADMIN"])],
			},
		},
		async (request, reply) => {
			const { organizationId } = request.user;
			const { productId } = request.params;

			const removeProductUseCase = new RemoveProductUseCase(
				new PrismaProductRepository(),
			);
			await removeProductUseCase.execute(productId, organizationId);

			return reply.send();
		},
	);
};
