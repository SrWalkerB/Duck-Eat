import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getMyCompanyDto } from "../../application/dto/get-my-company.dto";
import { GetMyCompanyUseCase } from "../../application/use-cases/get-my-company.use-case";
import { PrismaCompanyRepository } from "../db/prisma-company-repository";
import { auth } from "@/http/plugins/auth";

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
