import { prisma } from "@/lib/db/prisma";
import { getUserProfileDto } from "../dto/get-user-profile.dto";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";

export class GetUserProfileUseCase {
  async execute(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null
      },
      select: {
        id: true,
        name: true,
        account: {
          select: {
            email: true,
            role: true
          },
        }
      }
    });

    if (!user) {
      throw new ResourceNotFoundError("User not found");
    }


    return getUserProfileDto.parse({
      id: user.id,
      name: user.name,
      account: {
        email: user.account.email,
        role: user.account.role
      }
    });
  }
}