import { describe, expect, test } from "vitest";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { makeAccount } from "@/test/factories/make-account";
import { makeUser } from "@/test/factories/make-user";
import { InMemoryAccountRepository } from "../../infra/db/in-memory/in-memory-account-repository";
import { GetUserProfileUseCase } from "./get-user-profile.use-case";

describe("Get User Profile", () => {
	test("should return object of user profile RESTAURANT_ADMIN", async () => {
		const accountRepository = new InMemoryAccountRepository();

		const accountMock = makeAccount();
		const userMock = makeUser({
			accountId: accountMock.id,
		});

		accountRepository.accounts = [accountMock];
		accountRepository.users = [userMock];

		const sut = new GetUserProfileUseCase(accountRepository);

		const profile = await sut.execute(userMock.id);

		expect(profile).toEqual({
			id: expect.any(String),
			name: expect.any(String),
			account: {
				email: expect.any(String),
				role: "RESTAURANT_ADMIN",
			},
		});
	});

	test("should return error of User not found", async () => {
		const accountRepository = new InMemoryAccountRepository();
		const sut = new GetUserProfileUseCase(accountRepository);

		await expect(
			sut.execute("82d5805a-59bb-4656-8342-a46ccef7f072"),
		).rejects.toThrow(ResourceNotFoundError);
	});
});
