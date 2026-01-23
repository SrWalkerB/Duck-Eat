import { fastifyJwt } from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { type FastifyPluginAsync, fastify } from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env";
import { NotAuthorization } from "./errors/not-authorization.error";
import { ResourceConflictError } from "./errors/resource-conflict.error";
import { ResourceNotFoundError } from "./errors/resource-not-found.error";
import { accountRoutes } from "./modules/account/infra/http/account.routes";
import { authRoutes } from "./modules/auth/infra/http/auth.routes";
import { companyRoutes } from "./modules/company/infra/http/company.routes";
import { productRoutes } from "./modules/product/infra/http/product.routes";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.setErrorHandler((err, req, reply) => {
	if (hasZodFastifySchemaValidationErrors(err)) {
		return reply.code(400).send({
			error: "Response Validation Error",
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
			error: "Internal Server Error",
			message: "Response doesn't match the schema",
			statusCode: 500,
			details: {
				issues: err.cause.issues,
				method: err.method,
				url: err.url,
			},
		});
	}

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
		});
	}

	if (err instanceof ResourceConflictError) {
		return reply.code(409).send({
			error: err.name,
			message: err.message,
			statusCode: 409,
			details: {
				issues: err.message,
				method: req.method,
				url: req.url,
			},
		});
	}

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
		});
	}

	console.error(err);

	return reply.code(500).send({
		error: "Internal Server Error",
		message: "Response doesn't match the schema",
		statusCode: 500,
	});
});

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Duck Eat API",
			version: "0.0.1",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(ScalarApiReference, {
	routePrefix: "/docs",
});

const apiRoutes: FastifyPluginAsync = async (app) => {
	app.register(authRoutes);
	app.register(accountRoutes, { prefix: "/account" });
	app.register(companyRoutes, { prefix: "/company" });
	app.register(productRoutes, { prefix: "/product" });
};

app.register(apiRoutes, { prefix: "/api/v1" });

app.listen({ port: env.PORT, host: env.HOST }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(`⚡️ Server is running on ${address}`);
	console.log(`📚 Docs is running on ${address}/docs`);
});
