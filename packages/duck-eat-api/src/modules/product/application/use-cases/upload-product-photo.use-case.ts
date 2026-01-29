import { ResourceNotFoundError } from "@/errors/resource-not-found.error";
import { type MultipartFile } from "@fastify/multipart";
import { ProductRepository } from "../../domain/repositories/product-repository";
import { UploadProduct } from "../dto/upload-product.dto";
import { UploadFile } from "@/lib/storage/upload-file";

export class UploadProductPhotoUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly uploadFile: UploadFile,
  ) {}

  async execute(props: UploadProduct) {
    const searchProduct = await this.productRepository.findOne(
      props.productId,
      props.organizationId,
    );

    if (!searchProduct) {
      throw new ResourceNotFoundError("Product", "Product not found");
    }

    const upload = await this.uploadFile.upload(props.file);

    if (upload) {
      await this.productRepository.addPhoto(upload.key, props.productId);
    }

    console.log("upload");
  }
}
