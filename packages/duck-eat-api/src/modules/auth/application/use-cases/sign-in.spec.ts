import { describe, expect, test, beforeEach } from "vitest";
import { NotAuthorization } from "@/errors/not-authorization.error";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { InMemoryAccountRepository } from "@/test/repositories/in-memory-account-repository";
import { makeAccount } from "@/test/factories/make-account";
import { makeUser } from "@/test/factories/make-user";
import { SignInUseCase } from "./sign-in.use-case";
import { InMemoryOrganizationRepository } from "@/test/repositories/in-memory-organization.repository";
import { makeOrganization } from "@/test/factories/make-organization";
import { FakeJwtService } from "@/test/fakes/fake-jwt-service";
import { makePasswordHash } from "@/test/factories/make-password-hash";

let inMemoryAccountRepository: InMemoryAccountRepository;
let inMemoryOrganizationRepository: InMemoryOrganizationRepository;
let sut: SignInUseCase;

describe("Sign In", () => {
	beforeEach(() => {
		inMemoryAccountRepository = new InMemoryAccountRepository();
		inMemoryOrganizationRepository = new InMemoryOrganizationRepository();
		const fakeJwtService = new FakeJwtService();

		sut = new SignInUseCase(
			inMemoryAccountRepository,
			inMemoryOrganizationRepository,
			fakeJwtService,
		);
	});

	test("should return userId of user", async () => {
		const passwordHash = await makePasswordHash();

		const accountMock = makeAccount({
			password: passwordHash,
		});

		const userMock = makeUser({
			accountId: accountMock.id,
		});

		const organizationMock = makeOrganization({
			ownerId: userMock.id,
		});

		inMemoryOrganizationRepository.organizations.push(organizationMock);
		inMemoryAccountRepository.accounts.push(accountMock);
		inMemoryAccountRepository.users.push(userMock);

		const authenticated = await sut.execute({
			email: accountMock.email,
			password: "123456789",
		});

		expect(authenticated).toEqual({
			accessToken: expect.any(String),
			refreshToken: expect.any(String),
		});
	});

	test("should return error account not found", async () => {
		await expect(
			sut.execute({
				email: "email-not-found@gmail.com",
				password: "123456789",
			}),
		).rejects.toThrow(ResourceNotFoundError);
	});

	test("should return error account email or password", async () => {
		const passwordHash = await makePasswordHash("1234567890");

		const accountMock = makeAccount({
			email: `account@gmail.com`,
			password: passwordHash,
		});

		const userMock = makeUser({
			accountId: accountMock.id,
		});

		inMemoryAccountRepository.accounts = [accountMock];
		inMemoryAccountRepository.users = [userMock];

		await expect(
			sut.execute({
				email: "account@gmail.com",
				password: "31321",
			}),
		).rejects.toThrow(NotAuthorization);
	});
});
