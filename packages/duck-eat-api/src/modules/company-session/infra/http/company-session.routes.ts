import { auth } from "@/http/plugins/auth";
import { FastifyPluginAsync } from "fastify";
import { createSessionController } from "./create-session.controller";

export const companySessionRoutes: FastifyPluginAsync = async (app) => {
  app.register(auth);
  app.register(createSessionController, {
    prefix: "/",
  });
};
