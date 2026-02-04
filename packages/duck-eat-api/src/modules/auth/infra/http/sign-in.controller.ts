import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { PrismaAccountRepository } from "@/modules/account/infra/db/prisma-account-repository";
import {
	signInDto,
	signInResponseDto,
} from "@/modules/auth/application/dto/sign-in.dto";
import { SignInUseCase } from "@/modules/auth/application/use-cases/sign-in.use-case";
import { PrismaOrganizationRepository } from "@/modules/organization/infra/db/prisma-organization.repository";
import { FastifyJwtService } from "@/lib/cryptography/fastify-jwt-service";

export const signInController: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/sign-in",
		{
			schema: {
				summary: "Sign In",
				description: "Sign-in for account",
				tags: ["Auth", "Not Authenticated"],
				body: signInDto,
				response: {
					200: signInResponseDto,
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const signInUseCase = new SignInUseCase(
				new PrismaAccountRepository(),
				new PrismaOrganizationRepository(),
				new FastifyJwtService(app),
			);

			const { accessToken, refreshToken } = await signInUseCase.execute({
				email,
				password,
			});

			return await reply.send({
				accessToken,
				refreshToken,
			});
		},
	);
};
