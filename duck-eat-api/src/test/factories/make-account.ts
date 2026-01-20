import type { Account } from "@/generated/prisma/client";

export function makeAccount(override?: Partial<Account>) {
	const accountMock: Account = {
		id: `account-${new Date().getTime()}`,
		email: `account-duplicate@gmail.com`,
		password: "12345678",
		role: "RESTAURANT_ADMIN",
		provider: "email",
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
        ...override
	};

    return accountMock;
};
