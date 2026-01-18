import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { GetUserProfileUseCase } from "../application/use-cases/get-user-profile.use-case";
import { getUserProfileDto } from "../application/dto/get-user-profile.dto";

export const geUserProfileAuthenticated: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/profile",
    {
      schema: {
        summary: "Get User Profile Authenticated",
        tags: ["Authenticated", "Account"],
        response: {
          200: getUserProfileDto
        }
      }
    },
    async (request, reply) => {
      const { userId } = request.user;
      const getUserProfileUseCase = new GetUserProfileUseCase();
      const response = await getUserProfileUseCase.execute(userId);
      return reply.send(response);
    }
  )
}