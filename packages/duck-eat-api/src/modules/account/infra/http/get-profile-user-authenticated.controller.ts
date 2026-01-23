import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getUserProfileDto } from "../../application/dto/get-user-profile.dto";
import { GetUserProfileUseCase } from "../../application/use-cases/get-user-profile.use-case";
import { PrismaAccountRepository } from "../db/prisma-account-repository";

export const geUserProfileAuthenticated: FastifyPluginAsyncZod = async (
	app,
) => {
	app.get(
		"/profile",
		{
			schema: {
				summary: "Get User Profile Authenticated",
				tags: ["Authenticated", "Account"],
				response: {
					200: getUserProfileDto,
				},
			},
		},
		async (request, reply) => {
			const { userId } = request.user;
			const getUserProfileUseCase = new GetUserProfileUseCase(
				new PrismaAccountRepository(),
			);
			const response = await getUserProfileUseCase.execute(userId);
			return reply.send(response);
		},
	);
};
