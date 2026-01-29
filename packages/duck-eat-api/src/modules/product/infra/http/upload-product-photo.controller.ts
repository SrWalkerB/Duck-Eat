import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import multipart from "@fastify/multipart";
import { z } from "zod";
import { UploadProductPhotoUseCase } from "../../application/use-cases/upload-product-photo.use-case";
import { PrismaProductRepository } from "../db/prisma-product-repository";
import { S3UploadFile } from "@/lib/storage/s3-upload-file";

export const uploadProductPhotoController: FastifyPluginAsyncZod = async (
  app,
) => {
  app.register(multipart);
  app.post(
    ":productId/upload/photo",
    {
      schema: {
        params: z.object({
          productId: z.uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { organizationId } = request.user;
      const { productId } = request.params;
      const form = await request.file();

      if (!form) {
        return reply.send();
      }

      const uploadProductPhotoUseCase = new UploadProductPhotoUseCase(
        new PrismaProductRepository(),
        new S3UploadFile(),
      );

      const response = await uploadProductPhotoUseCase.execute({
        file: form,
        organizationId: organizationId,
        productId: productId,
      });

      return reply.send();
    },
  );
};
