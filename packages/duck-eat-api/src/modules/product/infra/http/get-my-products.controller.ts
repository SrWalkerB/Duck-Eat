import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const getMyProductsController: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/all",
		{
			schema: {
				summary: "List all products",
				description: "List all products of authenticated user",
			},
		},
		async (request, reply) => {
			return reply.send();
		},
	);
};
