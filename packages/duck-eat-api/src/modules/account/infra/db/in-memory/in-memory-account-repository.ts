import type { Account, ROLES, User } from "@/generated/prisma/client";
import type { GetUserProfile } from "@/modules/account/application/dto/get-user-profile.dto";
import type { AccountRepository } from "@/modules/account/domain/repositories/account-repository";
import type {
	CreateAccountEntity,
	GetAccountByEmail,
} from "@/modules/account/domain/types/account.types";

export class InMemoryAccountRepository implements AccountRepository {
	accounts: Account[] = [];
	users: User[] = [];

	async createAccount(props: CreateAccountEntity): Promise<{ userId: string }> {
		const accountId = `account-${new Date().getTime()}`;
		const userId = `user-${new Date().getTime()}`;

		this.accounts.push({
			id: accountId,
			email: props.email,
			password: props.password,
			role: props.role as ROLES,
			provider: props.provider,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		});

		this.users.push({
			id: userId,
			name: props.name,
			accountId: accountId,
			createdAt: new Date(),
			updatedAt: new Date(),
			deletedAt: null,
		});

		return {
			userId,
		};
	}

	async getAccountByEmail(email: string): Promise<GetAccountByEmail | null> {
		const searchAccount = this.accounts.find(
			(element) => element.email === email,
		);

		if (!searchAccount) {
			return null;
		}

		return {
			passwordHash: searchAccount.password,
			userId: searchAccount.id,
		};
	}

	async getUserProfile(userId: string): Promise<GetUserProfile | null> {
		const user = this.users.find(
			(element) => element.id === userId && !element.deletedAt,
		);

		if (!user) {
			return null;
		}

		const account = this.accounts.find(
			(element) => element.id === user.accountId && !element.deletedAt,
		);

		return {
			id: user.id,
			name: user.name,
			account: {
				email: account!.email,
				role: account!.role,
			},
		};
	}
}
