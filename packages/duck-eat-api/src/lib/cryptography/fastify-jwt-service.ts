import { JwtService } from "@/modules/auth/domain/types/jwt-service";
import { FastifyInstance } from "fastify";

export class FastifyJwtService implements JwtService {
	constructor(private readonly app: FastifyInstance) {}

	sign(
		payload: Record<string, string>,
		options: { expiresIn: string },
	): string {
		const token = this.app.jwt.sign(payload, {
			expiresIn: options.expiresIn,
		});

		return token;
	}
}
