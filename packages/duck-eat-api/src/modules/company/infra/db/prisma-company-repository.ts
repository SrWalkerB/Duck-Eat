import type { Company } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { CreateCompanyDto } from "../../application/dto/create-company.dto";
import type { GetMyCompanies } from "../../application/dto/get-my-company.dto";
import type { CompanyRepository } from "../../domain/repositories/company-repository";

export class PrismaCompanyRepository implements CompanyRepository {
  async create(props: CreateCompanyDto): Promise<{ companyId: string }> {
    const newCompany = await prisma.company.create({
      data: {
        cnpj: props.cnpj,
        tradeName: props.tradeName,
        organizationId: props.organizationId,
        companyTagId: props.companyTagId,
      },
    });

    await prisma.companyAbout.create({
      data: {
        companyId: newCompany.id,
        address: props.companyAbout.address,
        description: props.companyAbout.description,
      },
    });

    return {
      companyId: newCompany.id,
    };
  }

  async findByCnpj(cnpj: string): Promise<Company | null> {
    const company = await prisma.company.findFirst({
      where: {
        cnpj,
        deletedAt: null,
      },
    });

    return company;
  }

  async getCompaniesByOrganizationId(
    organizationId: string,
  ): Promise<GetMyCompanies> {
    const companies = await prisma.company.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        tradeName: true,
        cnpj: true,
        companyTag: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return companies;
  }

  async findById(companyId: string): Promise<Company | null> {
    const searchCompany = await prisma.company.findFirst({
      where: {
        id: companyId,
        deletedAt: null,
      },
    });

    if (!searchCompany) {
      return null;
    }

    return searchCompany;
  }
}
