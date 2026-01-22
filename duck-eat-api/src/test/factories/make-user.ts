import type { User } from "@/generated/prisma/client";

export function makeUser(override?: Partial<User>) {
	const userMock: User = {
		id: `82d5805a-59bb-4656-8342-a46ccef7f072`,
		name: `account-duplicate`,
		accountId: "82d5805a-59bb-4656-8342-a46ccef7f073",
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		...override,
	};

	return userMock;
}
