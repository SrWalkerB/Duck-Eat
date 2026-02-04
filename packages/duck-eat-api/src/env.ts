import { z } from "zod";

export const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	HOST: z.string().default("0.0.0.0"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	JWT_SECRET: z.string(),
	AWS_SECRET_KEY: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_REGION: z.string(),
	S3_BUCKET: z.string(),
});
export const env = envSchema.parse(process.env);
