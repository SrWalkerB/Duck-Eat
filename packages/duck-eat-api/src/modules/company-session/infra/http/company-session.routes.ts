import type { FastifyPluginAsync } from "fastify";
import { auth } from "@/http/plugins/auth";
import { createSessionController } from "./create-session.controller";
import { createCompanySessionProductController } from "./create-session-product.controller";
import { listCompanySessionController } from "./list-company-session.controller";

export const companySessionRoutes: FastifyPluginAsync = async (app) => {
	app.register(auth);
	app.register(listCompanySessionController);
	app.register(createSessionController);
	app.register(createCompanySessionProductController);
};
