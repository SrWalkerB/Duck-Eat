import { Hashing } from "@/lib/hashing";
import type { AccountRepository } from "@/modules/account/domain/repositories/account-repository";
import type { SignUpDto } from "../dto/sign-up.dto";
import { AccountAlreadyExistError } from "../error/account-already-exist.error";

export class SignUpUseCase {
	constructor(private readonly accountRepository: AccountRepository) {}

	async execute(props: SignUpDto) {
		const accountExists = await this.accountRepository.getAccountByEmail(
			props.email,
		);

		if (accountExists) {
			throw new AccountAlreadyExistError("Account already exist");
		}

		const passwordHash = await Hashing.hash(props.password);

		const userAccount = await this.accountRepository.createAccount({
			email: props.email,
			name: props.name,
			password: passwordHash,
			provider: "email",
			role: props.role,
		});

		return {
      userId: userAccount.userId
    };
	}
}
