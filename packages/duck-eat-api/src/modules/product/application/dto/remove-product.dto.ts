import { z } from "zod";

export const removeProductDto = z.object({
    productId: z.uuid()
});

export const removeProductResponse = z.void()