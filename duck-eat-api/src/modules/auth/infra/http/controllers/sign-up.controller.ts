import { prismaOrm } from "@/lib/db/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const signUpController: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/sign-up",
    {
      schema: {
        summary: "Sign Up",
        description: "Create admin account",
        tags: ["auth"],
        body: z.object({
          email: z.email(),
          password: z.string().min(8),
        }),
        response: {
          201: z.object({
            id: z.uuid()
          }),
          409: z.object({
            message: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const accountExists = await prismaOrm.account.findFirst({
        where: {
          email
        },
        select: {
          id: true
        }
      });

      if(accountExists){
        return reply.status(409).send({
          message: "Account already exists"
        })
      }

      const account = await prismaOrm.account.create({
        data: {
          email,
          password 
        }
      })
      return reply.status(201).send(account);
    }
  )
}