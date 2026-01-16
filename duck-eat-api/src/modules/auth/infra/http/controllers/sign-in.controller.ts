import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const signInController: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/sign-in",
    {
      schema: {
        summary: "Sign-in",
        description: "Sign-in",
        body: z.object({
          email: z.email(),
          password: z.string().min(8)
        })
      }
    },
    async (request, reply) => {
      const { email } = request.body;
      console.log(email);

      return await reply.send()
    }
  )
}