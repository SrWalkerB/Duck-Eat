import { z } from "zod";
import { MultipartFile } from '@fastify/multipart';

export const uploadProductDto = z.object({
    productId: z.uuid(),
    organizationId: z.uuid(),
    file: z.custom<MultipartFile>()
    .refine(file => !!file, "File is required")
});

export type UploadProduct = z.infer<typeof uploadProductDto>