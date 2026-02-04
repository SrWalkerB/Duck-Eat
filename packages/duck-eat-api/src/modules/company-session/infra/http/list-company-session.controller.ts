import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { listCompanySessionDto } from "../../application/dto/list-company-session.dto";
import { ListCompanySessionUseCase } from "../../application/use-cases/list-company-session.use-case";
import { PrismaCompanySessionRepository } from "../db/prisma-company-session.repository";
import { Can } from "@/http/plugins/can";

export const listCompanySessionController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.get(
		"/",
		{
			schema: {
				summary: "List Company Sessions",
				description: "list company session by organizations",
				response: {
					200: listCompanySessionDto,
				},
			},
			preHandler: [Can.role(["ADMIN", "RESTAURANT_ADMIN"])],
		},
		async (request, reply) => {
			const { organizationId } = request.user;
			const listCompanySessionUseCase = new ListCompanySessionUseCase(
				new PrismaCompanySessionRepository(),
			);
			const response = await listCompanySessionUseCase.execute(organizationId);
			return reply.send(response);
		},
	);
};
