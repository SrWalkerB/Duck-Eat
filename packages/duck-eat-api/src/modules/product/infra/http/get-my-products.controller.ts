import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ListProductsUseCase } from "../../application/use-cases/list-products.use-case";
import { PrismaProductRepository } from "../db/prisma-product-repository";
import { listProductsDto } from "../../application/dto/list-product.dto";
import { S3UploadFile } from "@/lib/storage/s3-upload-file";
import { Can } from "@/http/plugins/can";

export const getMyProductsController: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/all",
		{
			schema: {
				summary: "List all products",
				description: "List all products of organization",
				tags: ["Products", "Authenticated", "Organization"],
				response: {
					200: listProductsDto,
				},
				preHandler: [Can.role(["ADMIN", "RESTAURANT_ADMIN"])],
			},
		},
		async (request, reply) => {
			const { organizationId } = request.user;
			const listProductsUseCase = new ListProductsUseCase(
				new S3UploadFile(),
				new PrismaProductRepository(),
			);
			const response = await listProductsUseCase.execute(organizationId);

			return reply.send(response);
		},
	);
};
