import type { FastifyPluginAsync } from "fastify";
import { signInController } from "./sign-in.controller";
import { signUpController } from "./sign-up.controller";

export const authRoutes: FastifyPluginAsync = async (app) => {
	app.register(signInController, {
		prefix: "/auth",
	});

	app.register(signUpController, {
		prefix: "/auth",
	});
};
