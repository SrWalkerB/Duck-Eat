import { NotAuthorization } from "@/errors/not-authorization.error";
import { FastifyPluginAsync, preHandlerHookHandler } from "fastify";
import fastifyPlugin from "fastify-plugin";

export const auth = fastifyPlugin(async (app) => {
	app.addHook("onRequest", async (request) => {
		try {
			await request.jwtVerify();
		} catch (error) {
			console.error(error);
			throw new NotAuthorization();
		}
	});
});
