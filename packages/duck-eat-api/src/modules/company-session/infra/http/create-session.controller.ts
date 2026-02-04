import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
	createCompanySessionRequestDto,
	createCompanySessionResponseDto,
} from "@/modules/company-session/application/dto/create-company-session.dto";
import { CreateSessionUseCase } from "../../application/use-cases/create-session.use-case";
import { PrismaCompanySessionRepository } from "../db/prisma-company-session.repository";
import { Can } from "@/http/plugins/can";

export const createSessionController: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/",
		{
			schema: {
				summary: "Create session by company",
				description: "Create session by company and organization",
				tags: ["Session", "Authenticated", "Organization", "Company"],
				body: createCompanySessionRequestDto,
				response: {
					201: createCompanySessionResponseDto,
				},
				preHandler: [Can.role(["ADMIN", "RESTAURANT_ADMIN"])],
			},
		},
		async (request, reply) => {
			const { organizationId } = request.user;
			const { companyId, name } = request.body;

			const createSessionUseCase = new CreateSessionUseCase(
				new PrismaCompanySessionRepository(),
			);

			const response = await createSessionUseCase.execute({
				name,
				companyId,
				organizationId,
			});

			return reply.status(201).send(response);
		},
	);
};
