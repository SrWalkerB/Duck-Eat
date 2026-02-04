import type { FastifyPluginAsync } from "fastify";
import { auth } from "@/http/plugins/auth";
import { createProductController } from "./create-product.controller";
import { getMyProductsController } from "./get-my-products.controller";
import { removeProductController } from "./remove-product.controller";
import { uploadProductPhotoController } from "./upload-product-photo.controller";

export const productRoutes: FastifyPluginAsync = async (app) => {
	app.register(auth);
	app.register(createProductController);
	app.register(getMyProductsController);
	app.register(removeProductController);
	app.register(uploadProductPhotoController);
};
