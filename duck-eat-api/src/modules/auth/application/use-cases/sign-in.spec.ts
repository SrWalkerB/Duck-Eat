import { describe, expect, test } from "vitest";
import { NotAuthorization } from "@/errors/not-authorization.error";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { Hashing } from "@/lib/hashing";
import { InMemoryAccountRepository } from "@/modules/account/infra/db/in-memory/in-memory-account-repository";
import { makeAccount } from "@/test/factories/make-account";
import { makeUser } from "@/test/factories/make-user";
import { SignInUseCase } from "./sign-in.use-case";

describe("Sign In", () => {
	test("should return userId of user", async () => {
		const inMemoryAccountRepository = new InMemoryAccountRepository();
		const passwordHash = await Hashing.hash("123456789");

		const accountMock = makeAccount({
			password: passwordHash,
		});

		const userMock = makeUser({
			accountId: accountMock.id,
		});

		inMemoryAccountRepository.accounts = [accountMock];
		inMemoryAccountRepository.users = [userMock];

		const sut = new SignInUseCase(inMemoryAccountRepository);
		const authenticated = await sut.execute({
			email: accountMock.email,
			password: "123456789",
		});

		expect(authenticated).toEqual({
			userId: expect.any(String),
		});
	});

	test("should return error account not found", async () => {
		const inMemoryAccountRepository = new InMemoryAccountRepository();
		const signInUseCase = new SignInUseCase(inMemoryAccountRepository);

		await expect(
			signInUseCase.execute({
				email: "email-not-found@gmail.com",
				password: "123456789",
			}),
		).rejects.toThrow(ResourceNotFoundError);
	});

	test("should return error account email or password", async () => {
		const inMemoryAccountRepository = new InMemoryAccountRepository();
		const passwordHash = await Hashing.hash("1234567890");

		const accountMock = makeAccount({
			email: `account@gmail.com`,
			password: passwordHash,
		});

		const userMock = makeUser({
			accountId: accountMock.id,
		});

		inMemoryAccountRepository.accounts = [accountMock];
		inMemoryAccountRepository.users = [userMock];
		const sut = new SignInUseCase(inMemoryAccountRepository);

		await expect(
			sut.execute({
				email: "account@gmail.com",
				password: "31321",
			}),
		).rejects.toThrow(NotAuthorization);
	});
});
