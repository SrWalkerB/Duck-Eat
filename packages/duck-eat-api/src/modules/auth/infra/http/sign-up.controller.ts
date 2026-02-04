import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { PrismaAccountRepository } from "@/modules/account/infra/db/prisma-account-repository";
import { signUpDto } from "@/modules/auth/application/dto/sign-up.dto";
import { AccountAlreadyExistError } from "@/modules/auth/application/error/account-already-exist.error";
import { SignUpUseCase } from "@/modules/auth/application/use-cases/sign-up.use-case";
import { PrismaCompanyRepository } from "@/modules/company/infra/db/prisma-company-repository";
import { PrismaCompanyTagRepository } from "@/modules/company/infra/db/prisma-company-tag-repository";
import { PrismaOrganizationRepository } from "@/modules/organization/infra/db/prisma-organization.repository";

export const signUpController: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/sign-up",
		{
			schema: {
				summary: "Sign Up",
				description: "Create account",
				tags: ["Auth", "Not Authenticated"],
				body: signUpDto,
				response: {
					201: z.object({
						id: z.uuid(),
					}),
					409: z.object({
						message: z.string(),
					}),
					404: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { account, company } = request.body;
			try {
				const signUpUseCase = new SignUpUseCase(
					new PrismaAccountRepository(),
					new PrismaCompanyRepository(),
					new PrismaCompanyTagRepository(),
					new PrismaOrganizationRepository(),
				);

				const response = await signUpUseCase.execute({
					account,
					company,
				});

				return reply.status(201).send({
					id: response.userId,
				});
			} catch (error) {
				console.error(error);

				if (error instanceof AccountAlreadyExistError) {
					return reply.status(409).send({
						message: error.message,
					});
				}

				if (error instanceof ResourceNotFoundError) {
					return reply.status(404).send({
						message: error.message,
					});
				}

				return reply.status(500).send({
					message: "Internal server error",
				});
			}
		},
	);
};
