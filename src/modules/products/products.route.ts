import express from "express";
import { USER_ROLE } from "../../constants/status.constants";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/multer";
import { productController } from "./products.controller";
import { productValidation } from "./products.validation";

const router = express.Router();

router.post(
    "/",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 10 }
    ]),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(productValidation.createProductZodSchema),
    productController.createProductController
);

router.patch(
    "/:id",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "images", maxCount: 10 }
    ]),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(productValidation.updateProductZodSchema),
    productController.updateProductController
);

router.delete(
    "/:id",
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    productController.deleteProductController
);

router.get(
    "/:id",
    auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    productController.getProductByIdController
);

router.get(
    "/",
    auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    productController.getAllProductsController
);

export const productRoutes = router;
