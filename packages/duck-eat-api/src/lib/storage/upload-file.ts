import { type MultipartFile } from "@fastify/multipart";

export interface UploadFile {
  upload(
    file: MultipartFile,
  ): Promise<{ url: string; key: string } | undefined>;
  getSignedUrlByKey(key: string): Promise<{ url: string }>;
}
