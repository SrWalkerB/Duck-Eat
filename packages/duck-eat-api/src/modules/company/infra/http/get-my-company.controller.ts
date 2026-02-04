import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getMyCompanyDto } from "../../application/dto/get-my-company.dto";
import { GetMyCompanyUseCase } from "../../application/use-cases/get-my-company.use-case";
import { PrismaCompanyRepository } from "../db/prisma-company-repository";
import { auth } from "@/http/plugins/auth";
import { Can } from "@/http/plugins/can";

export const getMyCompanyController: FastifyPluginAsyncZod = async (app) => {
	app.register(auth);
	app.get(
		"/",
		{
			schema: {
				summary: "Get my company",
				description: "get my company owner by user logged",
				tags: ["Company", "Authenticated", "Organization"],
				response: {
					200: getMyCompanyDto,
				},
				preHandler: [Can.role(["ADMIN", "RESTAURANT_ADMIN"])],
			},
		},
		async (request, reply) => {
			const { organizationId } = request.user;
			const geyMyCompanyUseCase = new GetMyCompanyUseCase(
				new PrismaCompanyRepository(),
			);
			const response = await geyMyCompanyUseCase.execute(organizationId);

			return reply.status(200).send(response);
		},
	);
};
