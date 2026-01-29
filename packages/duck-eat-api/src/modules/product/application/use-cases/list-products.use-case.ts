import { UploadFile } from "@/lib/storage/upload-file";
import { ProductRepository } from "../../domain/repositories/product-repository";
import { ListProduct } from "../dto/list-product.dto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class ListProductsUseCase {
  constructor(
    private readonly uploadFile: UploadFile,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(organizationId: string): Promise<ListProduct> {
    const response = await this.productRepository.listProducts(organizationId);

    const productList = await Promise.all(
      response.map(async (item) => {
        return {
          ...item,
          productPhotos: await Promise.all(
            item.productPhotos.map(async (photo) => {
              const photoSigned = await this.uploadFile.getSignedUrlByKey(
                photo.photoUrlKey,
              );

              return {
                photoUrl: photoSigned.url,
              };
            }),
          ),
        };
      }),
    );

    return productList;
  }
}
