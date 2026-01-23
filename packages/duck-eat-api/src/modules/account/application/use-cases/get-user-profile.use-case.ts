import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import type { AccountRepository } from "../../domain/repositories/account-repository";
import { getUserProfileDto } from "../dto/get-user-profile.dto";

export class GetUserProfileUseCase {
	constructor(private readonly accountRepository: AccountRepository) {}

	async execute(userId: string) {
		const user = await this.accountRepository.getUserProfile(userId);

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		return getUserProfileDto.parse(user);
	}
}
