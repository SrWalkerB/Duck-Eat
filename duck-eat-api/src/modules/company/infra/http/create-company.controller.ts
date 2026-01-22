import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {
	createCompanyRequestDto,
	createCompanyResponseDto,
} from "../../application/dto/create-company.dto";
import { CreateCompanyUseCase } from "../../application/use-cases/create-company.use-case";
import { PrismaCompanyRepository } from "../db/prisma-company-repository";
import { PrismaCompanyTagRepository } from "../db/prisma-company-tag-repository";

export const createCompanyController: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/",
		{
			schema: {
				summary: "Create company",
				tags: ["Company", "Authenticated"],
				body: createCompanyRequestDto,
				response: {
					201: createCompanyResponseDto,
				},
			},
		},
		async (request, reply) => {
			const { cnpj, tradeName, companyTagId, companyAbout } = request.body;
			const { userId } = request.user;

			const createCompanyUseCase = new CreateCompanyUseCase(
				new PrismaCompanyRepository(),
				new PrismaCompanyTagRepository(),
			);

			const response = await createCompanyUseCase.execute({
				tradeName,
				cnpj,
				ownerId: userId,
				companyTagId,
				companyAbout
			});

			return reply.status(201).send(response);
		},
	);
};
