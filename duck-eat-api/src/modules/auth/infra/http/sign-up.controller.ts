import { signUpDto } from "@/modules/auth/application/dto/sign-up.dto";
import { AccountAlreadyExistError } from "@/modules/auth/application/error/account-already-exist.error";
import { SignUpUseCase } from "@/modules/auth/application/use-cases/sign-up.use-case";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const signUpController: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/sign-up",
    {
      schema: {
        summary: "Sign Up",
        description: "Create account",
        tags: ["Auth"],
        body: signUpDto,
        response: {
          201: z.object({
            id: z.uuid()
          }),
          409: z.object({
            message: z.string()
          }),
        }
      }
    },
    async (request, reply) => {
      const { email, password, name, role } = request.body;

      try {
        const signUpUseCase = new SignUpUseCase();

        const response = await signUpUseCase.execute({
          email,
          name,
          password,
          role
        });

        return reply.status(201).send(response);
      } catch (error) {
        if (error instanceof AccountAlreadyExistError) {
          return reply.status(409).send({
            message: error.message
          });
        }
      }
    }
  )
}