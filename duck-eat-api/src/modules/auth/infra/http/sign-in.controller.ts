import { signInDto } from "@/modules/auth/application/dto/sign-in.dto";
import { SignInUseCase } from "@/modules/auth/application/use-cases/sign-in.use-case";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const signInController: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/sign-in",
    {
      schema: {
        summary: "Sign In",
        description: "Sign-in for account",
        tags: ["Auth"],
        body: signInDto,
        response: {
          200: z.object({
            token: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const signInUseCase = new SignInUseCase();
      const response = await signInUseCase.execute({ email, password });

      const token = app.jwt.sign({
        userId: response.userId
      });

      return await reply.send({
        token
      })
    }
  )
}