import { randomUUID } from "node:crypto";
import type { Organization, OrganizationMembers } from "@/generated/prisma/client";
import type {
  CreateOrganizationEntity,
  OrganizationRepository,
} from "../../modules/organization/domain/repositories/organization.repository";


export class InMemoryOrganizationRepository implements OrganizationRepository {
  organizations: Organization[] = [];
  organizationMembers: OrganizationMembers[] = [];

  async create(props: CreateOrganizationEntity): Promise<{ id: string }> {
    const newOrganization: Organization = {
      id: randomUUID(),
      name: props.name,
      slug: props.slug,
      ownerId: props.ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    };

    this.organizations.push(newOrganization);

    return {
      id: newOrganization.id
    };
  };

  async addMember(userId: string, organizationId: string): Promise<{ id: string }> {
    const newMember: OrganizationMembers = {
      id: randomUUID(),
      userId,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    this.organizationMembers.push(newMember);

    return {
      id: newMember.id
    }
  }

  async findOrganizationByUserId(userId: string): Promise<Organization | null> {
    const searchOrganization = this.organizations.find((element => element.ownerId === userId));

    return searchOrganization ? searchOrganization : null;
  }
}
