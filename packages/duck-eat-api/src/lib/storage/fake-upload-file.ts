import { MultipartFile } from "@fastify/multipart";
import { UploadFile } from "./upload-file";

export class FakeUploadFile implements UploadFile {
	async upload(
		file: MultipartFile,
	): Promise<{ url: string; key: string } | undefined> {
		return {
			key: "",
			url: "",
		};
	}

	async getSignedUrlByKey(key: string): Promise<{ url: string }> {
		return {
			url: "",
		};
	}
}
