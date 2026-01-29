import {
  createSessionRequestDto,
  createSessionResponseDto,
} from "@/modules/company-session/application/dto/create-session.dto";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { CreateSessionUseCase } from "../../application/use-cases/create-session.use-case";
import { PrismaCompanySessionRepository } from "../db/prisma-company-session.repository";

export const createSessionController: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/session",
    {
      schema: {
        summary: "Create session by company",
        description: "Create session by company and organization",
        tags: ["Session", "Authenticated", "Organization", "Company"],
        body: createSessionRequestDto,
        response: {
          201: createSessionResponseDto,
        },
      },
    },
    async (request, reply) => {
      const { organizationId } = request.user;
      const { companyId, name } = request.body;

      const createSessionUseCase = new CreateSessionUseCase(
        new PrismaCompanySessionRepository(),
      );

      const response = await createSessionUseCase.execute({
        name,
        companyId,
        organizationId,
      });

      return reply.status(201).send(response);
    },
  );
};
