import { describe, expect, test } from "vitest";
import { InMemoryAccountRepository } from "@/modules/account/infra/db/in-memory/in-memory-account-repository";
import { makeAccount } from "@/test/factories/make-account";
import { makeUser } from "@/test/factories/make-user";
import { AccountAlreadyExistError } from "../error/account-already-exist.error";
import { SignUpUseCase } from "./sign-up.use-case";

describe("Sign Up", () => {
	test("should create an account when email does not exist", async () => {
		const inMemoryAccountRepository = new InMemoryAccountRepository();
		const sut = new SignUpUseCase(inMemoryAccountRepository);

		const response = await sut.execute({
			email: "email@gmail.com",
			name: "Walker",
			password: "12345678",
			role: "RESTAURANT_ADMIN",
		});

		expect(response).toEqual({
			userId: expect.any(String),
		});
	});

	test("should returning error to duplicate email", async () => {
		const accountMock = makeAccount();
		const userMock = makeUser({
			accountId: accountMock.id,
		});

		const inMemoryAccountRepository = new InMemoryAccountRepository();

		inMemoryAccountRepository.accounts = [accountMock];
		inMemoryAccountRepository.users = [userMock];

		const sut = new SignUpUseCase(inMemoryAccountRepository);

		await expect(
			sut.execute({
				email: accountMock.email,
				name: userMock.name,
				password: accountMock.password,
				role: "RESTAURANT_ADMIN",
			}),
		).rejects.toThrow(AccountAlreadyExistError);
	});
});
