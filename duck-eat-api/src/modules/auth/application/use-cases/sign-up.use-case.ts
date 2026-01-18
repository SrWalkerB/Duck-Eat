import { prisma } from "@/lib/db/prisma";
import { AccountAlreadyExistError } from "../error/account-already-exist.error";
import { SignUpDto } from "../dto/sign-up.dto";
import { Hashing } from "@/lib/hashing";

export class SignUpUseCase {
  async execute(props: SignUpDto) {
    const accountExists = await prisma.account.findFirst({
      where: {
        email: props.email,
        deletedAt: null
      },
      select: {
        id: true
      }
    });

    if (accountExists) {
      throw new AccountAlreadyExistError("Account already exist");
    };

    const passwordHash = await Hashing.hash(props.password);

    const account = await prisma.account.create({
      data: {
        email: props.email,
        password: passwordHash,
        role: props.role,
        provider: "email",
        users: {
          create: {
            name: props.name
          }
        }
      }
    });

    return account;
  }
}