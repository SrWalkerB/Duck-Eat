import { FastifyPluginAsync } from "fastify";
import { auth } from "@/http/plugins/auth";
import { geUserProfileAuthenticated } from "./get-profile-user-authenticated.controller";

export const accountRoutes: FastifyPluginAsync = async (app) => {
  app.register(auth);
  app.register(geUserProfileAuthenticated, {
    prefix: "/"
  });
}