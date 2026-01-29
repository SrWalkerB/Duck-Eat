import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createSessionProductRequestDto } from "../../application/dto/create-session-product.dto";

export const createSessionProductController: FastifyPluginAsyncZod = async (
  app,
) => {
  app.post(
    "/session-product",
    {
      schema: {
        summary: "Create session product",
        description: "create session product by organization",
        tags: [
          "Session",
          "Authenticated",
          "Organization",
          "Company",
          "Product",
        ],
        body: createSessionProductRequestDto,
      },
    },
    async (request, reply) => {
      const { organizationId } = request.user;
      const { companyId, name } = request.body;

      return reply.send();
    },
  );
};
