import { auth } from "@/http/plugins/auth";
import { FastifyPluginAsync } from "fastify";
import { createProductController } from "./create-product.controller";
import { getMyProductsController } from "./get-my-products.controller";
import { removeProductController } from "./remove-product.controller";
import { uploadProductPhotoController } from "./upload-product-photo.controller";
import { createSessionProductController } from "../../../company-session/infra/http/create-session-product.controller";

export const productRoutes: FastifyPluginAsync = async (app) => {
  app.register(auth);
  app.register(createProductController, {
    prefix: "/new",
  });
  app.register(getMyProductsController, {
    prefix: "/",
  });
  app.register(removeProductController, {
    prefix: "/",
  });
  app.register(uploadProductPhotoController, {
    prefix: "/",
  });
  app.register(createSessionProductController, {
    prefix: "/",
  });
};
