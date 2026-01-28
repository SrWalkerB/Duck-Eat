import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getCompanyTagDto } from "../../application/dto/get-company-tag.dto";
import { GetCompanyTagUseCase } from "../../application/use-cases/get-company-tag.use-case";
import { PrismaCompanyTagRepository } from "../db/prisma-company-tag-repository";

export const GetCompanyTagController: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/",
		{
			schema: {
				summary: "Company Tag",
				description: "Get company tag",
				tags: [
					"Company",
					"Public"
				],
				response: {
					200: getCompanyTagDto,
				},
			},
		},
		async (_, reply) => {
			const getCompanyTagUseCase = new GetCompanyTagUseCase(
				new PrismaCompanyTagRepository(),
			);
			const response = await getCompanyTagUseCase.execute();

			return reply.send(response);
		},
	);
};
