import { fastify, FastifyPluginAsync } from "fastify";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { env } from "./env";
import {
  validatorCompiler,
  serializerCompiler,
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  jsonSchemaTransform
} from "fastify-type-provider-zod";
import { fastifyJwt } from "@fastify/jwt";
import { authRoutes } from "./modules/auth/infra/http/auth.routes";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";
import { NotAuthorization } from "./errors/not-authorization.error";
import { accountRoutes } from "./modules/account/infra/account.routes";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.setErrorHandler((err, req, reply) => {
  if (hasZodFastifySchemaValidationErrors(err)) {
    return reply.code(400).send({
      error: 'Response Validation Error',
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: {
        issues: err.validation,
        method: req.method,
        url: req.url,
      },
    });
  }

  if (isResponseSerializationError(err)) {
    return reply.code(500).send({
      error: 'Internal Server Error',
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: err.cause.issues,
        method: err.method,
        url: err.url,
      },
    });
  };

  if (err instanceof ResourceNotFoundError) {
    return reply.code(404).send({
      error: err.name,
      message: err.message,
      statusCode: 404,
      details: {
        issues: err.message,
        method: req.method,
        url: req.url,
      },
    })
  };

  if (err instanceof NotAuthorization) {
    return reply.code(401).send({
      error: err.name,
      message: err.message,
      statusCode: 401,
      details: {
        issues: err.message,
        method: req.method,
        url: req.url,
      },
    })
  }

  console.error(err);

  return reply.code(500).send({
    error: 'Internal Server Error',
    message: "Response doesn't match the schema",
    statusCode: 500,
  });
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Duck Eat API",
      version: "0.0.1"
    }
  },
  transform: jsonSchemaTransform
})

app.register(ScalarApiReference, {
  routePrefix: "/docs"
});

const apiRoutes: FastifyPluginAsync = async (app) => {
  app.register(authRoutes);
  app.register(accountRoutes, { prefix: "/account" });
}

app.register(apiRoutes, { prefix: "/api/v1" });

app.listen({ port: env.PORT, host: env.HOST }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`⚡️ Server is running on ${address}`);
  console.log(`📚 Docs is running on ${address}/docs`);
});