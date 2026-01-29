import { prisma } from "@/lib/db/prisma";
import { CreateSession } from "../../application/dto/create-session.dto";
import { CompanySessionRepository } from "../../domain/repositories/company-session.repository";

export class PrismaCompanySessionRepository implements CompanySessionRepository {
  async create(props: CreateSession): Promise<{ id: string }> {
    const newCompanySession = await prisma.companySession.create({
      data: {
        name: props.name,
        companyId: props.companyId,
      },
      select: {
        id: true,
      },
    });

    return {
      id: newCompanySession.id,
    };
  }
}
