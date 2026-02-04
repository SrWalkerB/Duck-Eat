import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PrismaCompanyRepository } from "@/modules/company/infra/db/prisma-company-repository";
import { PrismaProductRepository } from "@/modules/product/infra/db/prisma-product-repository";
import { createSessionProductRequestDto } from "../../application/dto/create-company-session-product.dto";
import { CreateSessionProductUseCase } from "../../application/use-cases/create-session-product.use-case";
import { PrismaCompanySessionRepository } from "../db/prisma-company-session.repository";
import { Can } from "@/http/plugins/can";

export const createCompanySessionProductController: FastifyPluginAsyncZod =
	async (app) => {
		app.post(
			"/company-session-product",
			{
				schema: {
					summary: "Create session product",
					description: "create session product by organization",
					tags: [
						"Session",
						"Authenticated",
						"Organization",
						"Company",
						"Product",
					],
					body: createSessionProductRequestDto,
					preHandler: [Can.role(["ADMIN", "RESTAURANT_ADMIN"])],
				},
			},
			async (request, reply) => {
				const { organizationId } = request.user;
				const { companyId, productIds, companySessionId } = request.body;

				const createSessionProductUseCase = new CreateSessionProductUseCase(
					new PrismaCompanySessionRepository(),
					new PrismaCompanyRepository(),
					new PrismaProductRepository(),
				);
				const response = await createSessionProductUseCase.execute({
					companyId,
					organizationId,
					productIds,
					companySessionId,
				});

				return reply.send(response);
			},
		);
	};
