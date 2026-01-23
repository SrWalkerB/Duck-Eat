import { CompanyProduct } from "@/generated/prisma/client";

export interface CreateProductEntity {
	name: string;
	price: number;
	companyId: string;
	description: string | null;
}

export interface ProductRepository {
	create(props: CreateProductEntity): Promise<{ id: string }>;
	listProductsByOwnerId(ownerId: string): Promise<CompanyProduct[]>;
}
