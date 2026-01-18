import { NotAuthorization } from "@/errors/not-authorization.error";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { prisma } from "@/lib/db/prisma";
import { Hashing } from "@/lib/hashing";
import type { AccountRepository } from "@/modules/account/domain/repositories/account-repository";
import type { SignInDto } from "../dto/sign-in.dto";

export class SignInUseCase {
	constructor(private readonly accountRepository: AccountRepository) {}

	async execute(props: SignInDto) {
		const { email, password } = props;

		const account = await this.accountRepository.getAccountByEmail(email);

		if (!account) {
			throw new ResourceNotFoundError("Account", "Account not found");
		}

		const passwordCheck = await Hashing.verify(account.passwordHash, password);

		if (!passwordCheck) {
			throw new NotAuthorization("Account", "email or password incorrect");
		}

		return {
			userId: account.userId,
		};
	}
}
