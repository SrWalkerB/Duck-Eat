import { Product } from "@/generated/prisma/client";
import { ListProduct } from "../../application/dto/list-product.dto";

export interface CreateProductEntity {
  name: string;
  price: number;
  organizationId: string;
  description: string | null;
}

export interface ListProductData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  productPhotos: {
    photoUrlKey: string;
  }[];
}

export interface ProductRepository {
  create(props: CreateProductEntity): Promise<{ id: string }>;
  listProducts(organizationId: string): Promise<ListProductData[]>;
  findOne(productId: string, organizationId: string): Promise<Product | null>;
  removeById(productId: string): Promise<void>;
  addPhoto(productKey: string, productId: string): Promise<void>;
}
