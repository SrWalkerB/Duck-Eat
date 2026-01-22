import type { ROLES } from "@/generated/prisma/enums";
import { prisma } from "@/lib/db/prisma";
import type { GetUserProfile } from "../../application/dto/get-user-profile.dto";
import type { AccountRepository } from "../../domain/repositories/account-repository";
import type {
	CreateAccountEntity,
	GetAccountByEmail,
} from "../../domain/types/account.types";

export class PrismaAccountRepository implements AccountRepository {
	async getAccountByEmail(email: string): Promise<GetAccountByEmail | null> {
		const userAccount = await prisma.account.findFirst({
			where: {
				email,
				deletedAt: null,
			},
			select: {
				users: {
					select: {
						id: true,
					},
				},
				password: true,
			},
		});

		if (!userAccount) {
			return null;
		}

		return {
			passwordHash: userAccount.password,
			userId: userAccount.users[0].id,
		};
	}

	async createAccount(props: CreateAccountEntity): Promise<{ userId: string }> {
		const userAccount = await prisma.user.create({
			data: {
				name: props.name,
				account: {
					create: {
						email: props.email,
						password: props.password,
						provider: props.provider,
						role: props.role as ROLES,
					},
				},
			},
		});

		return {
			userId: userAccount.id,
		};
	}

	async getUserProfile(userId: string): Promise<GetUserProfile | null> {
		const userProfile = await prisma.user.findFirst({
			where: {
				id: userId,
				deletedAt: null,
			},
			select: {
				id: true,
				name: true,
				account: {
					select: {
						email: true,
						role: true,
					},
				},
			},
		});

		if (!userProfile) {
			return null;
		}

		return userProfile;
	}
}
