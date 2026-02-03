import { describe, expect, test, beforeEach } from "vitest";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { makeAccount } from "@/test/factories/make-account";
import { makeUser } from "@/test/factories/make-user";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account-repository";
import { GetUserProfileUseCase } from "./get-user-profile.use-case";

let inMemoryAccountRepository: InMemoryAccountRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile", () => {
	beforeEach(() => {
		inMemoryAccountRepository = new InMemoryAccountRepository();
		sut = new GetUserProfileUseCase(inMemoryAccountRepository);
	});

	test("should return object of user profile RESTAURANT_ADMIN", async () => {
		const accountMock = makeAccount();
		const userMock = makeUser({
			accountId: accountMock.id,
		});

		inMemoryAccountRepository.accounts = [accountMock];
		inMemoryAccountRepository.users = [userMock];

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
		await expect(
			sut.execute("82d5805a-59bb-4656-8342-a46ccef7f072"),
		).rejects.toThrow(ResourceNotFoundError);
	});
});
