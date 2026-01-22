import type { CompanyTag } from "@/generated/prisma/client";

export interface CompanyTagRepository {
	listAll(): Promise<CompanyTag[]>;
	findById(id: string): Promise<CompanyTag | null>;
}
