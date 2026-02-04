import type { FastifyPluginAsync } from "fastify";
import { auth } from "@/http/plugins/auth";
import { createCompanyController } from "./create-company.controller";
import { GetCompanyTagController } from "./get-company-tag.controller";
import { getMyCompanyController } from "./get-my-company.controller";

export const companyRoutes: FastifyPluginAsync = async (app) => {
	app.register(createCompanyController, {
		prefix: "/new",
	});
	app.register(getMyCompanyController, {
		prefix: "/my-company",
	});
	app.register(GetCompanyTagController, {
		prefix: "/company-tag",
	});
};
