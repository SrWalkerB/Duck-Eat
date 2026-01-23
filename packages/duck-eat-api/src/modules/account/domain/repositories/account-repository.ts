import type { GetUserProfile } from "../../application/dto/get-user-profile.dto";
import type {
	CreateAccountEntity,
	GetAccountByEmail,
} from "../types/account.types";

export interface AccountRepository {
	getAccountByEmail(email: string): Promise<GetAccountByEmail | null>;
	createAccount(props: CreateAccountEntity): Promise<{ userId: string }>;
	getUserProfile(userId: string): Promise<GetUserProfile | null>;
}
