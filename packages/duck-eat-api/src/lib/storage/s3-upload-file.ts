import { env } from "@/env";
import { type MultipartFile } from "@fastify/multipart";
import { s3 } from "./s3.provider";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { UploadFile } from "./upload-file";

export class S3UploadFile implements UploadFile {
	private readonly bucketName: string = env.S3_BUCKET;

	async upload(file: MultipartFile) {
		try {
			const key = `uploads/${randomUUID()}-${file.filename}`;

			await s3.send(
				new PutObjectCommand({
					Bucket: this.bucketName,
					Key: key,
					Body: await file.toBuffer(),
					ContentType: file.mimetype,
				}),
			);

			const url = await getSignedUrl(
				s3,
				new GetObjectCommand({
					Bucket: this.bucketName,
					Key: key,
				}),
				{
					expiresIn: 60 * 5,
				},
			);

			return {
				url,
				key,
			};
		} catch (error) {
			console.error(error);
		}
	}

	async getSignedUrlByKey(key: string): Promise<{ url: string }> {
		const url = await getSignedUrl(
			s3,
			new GetObjectCommand({
				Bucket: this.bucketName,
				Key: key,
			}),
			{
				expiresIn: 60 * 5,
			},
		);

		return {
			url,
		};
	}
}
