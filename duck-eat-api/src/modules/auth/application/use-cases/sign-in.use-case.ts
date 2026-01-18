import { prisma } from "@/lib/db/prisma";
import { SignInDto } from "../dto/sign-in.dto";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { Hashing } from "@/lib/hashing";
import { NotAuthorization } from "@/errors/not-authorization.error";

export class SignInUseCase {
  async execute(props: SignInDto) {
    const { email, password } = props;

    const userAccount = await prisma.account.findFirst({
      where: {
        email,
        deletedAt: null
      },
      select: {
        users: {
          select: {
            id: true
          }
        },
        password: true
      }
    });

    if (!userAccount) {
      throw new ResourceNotFoundError("Account", "Account not found");
    };

    const passwordCheck = await Hashing.verify(userAccount.password, password);

    if (!passwordCheck) {
      throw new NotAuthorization("Account", "email or password incorrect");
    }

    return {
      userId: userAccount.users[0].id
    }
  }
}