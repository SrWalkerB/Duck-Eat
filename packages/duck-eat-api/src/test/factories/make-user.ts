import { randomUUID } from "node:crypto";
import type { User } from "@/generated/prisma/client";

export function makeUser(override?: Partial<User>) {
	const userMock: User = {
		id: randomUUID(),
		name: `account-duplicate`,
		accountId: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		...override,
	};

	return userMock;
}
