import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/multer";
import { productController } from "./products.controller";
import { productValidation } from "./products.validation";

const router = express.Router();

router.post(
    "/",
    upload.single("imageFile"),
    validateRequest(productValidation.createProductZodSchema),
    productController.createProductController
);

router.patch(
    "/:id",
    upload.single("imageFile"),
    validateRequest(productValidation.updateProductZodSchema),
    productController.updateProductController
);

router.delete(
    "/:id",
    productController.deleteProductController
);

router.get(
    "/:id",
    productController.getProductByIdController
);

router.get(
    "/",
    productController.getAllProductsController
);

export const productRoutes = router;
