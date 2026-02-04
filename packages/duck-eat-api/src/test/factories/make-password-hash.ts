import { Hashing } from "@/lib/cryptography/hashing";

export async function makePasswordHash(password?: string) {
	return await Hashing.hash(password ?? "123456789");
}
