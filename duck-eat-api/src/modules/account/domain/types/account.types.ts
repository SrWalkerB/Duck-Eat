export interface GetAccountByEmail {
	userId: string;
	passwordHash: string;
}

export interface CreateAccountEntity {
	email: string;
    name: string;
	password: string;
	role: string;
	provider: string;
}