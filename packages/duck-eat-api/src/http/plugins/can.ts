import { NotAuthorization } from "@/errors/not-authorization.error";
import { ROLES } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import { FastifyRequest } from "fastify";

export class Can {
	static role(roles: ROLES[]) {
		return async (request: FastifyRequest) => {
			const { userId } = request.user;
			const searchRole = await prisma.user.findFirst({
				where: {
					deletedAt: null,
					id: userId,
					account: {
						role: {
							in: roles,
						},
					},
				},
				select: {
					id: true,
				},
			});

			if (!searchRole) {
				throw new NotAuthorization();
			}
		};
	}
}
