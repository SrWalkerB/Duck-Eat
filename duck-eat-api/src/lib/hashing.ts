import argon2 from "argon2";

export class Hashing {
	static async hash(data: string) {
		return await argon2.hash(data);
	}

	static async verify(hash: string, data: string) {
		return await argon2.verify(hash, data);
	}
}
