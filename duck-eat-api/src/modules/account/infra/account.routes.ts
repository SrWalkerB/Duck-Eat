import { FastifyPluginAsync } from "fastify";
import { geUserProfileAuthenticated } from "./get-profile-user-authenticated.controller";
import { auth } from "@/http/plugins/auth";

export const accountRoutes: FastifyPluginAsync = async (app) => {
  app.register(auth);
  app.register(geUserProfileAuthenticated, {
    prefix: "/"
  });
}