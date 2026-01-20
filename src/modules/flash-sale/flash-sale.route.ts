import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/multer";
import { flashSaleController } from "./flash-sale.controller";
import { flashSaleValidation } from "./flash-sale.validation";

const router = express.Router();

router.post(
    "/",
    upload.single("imageFile"),
    validateRequest(flashSaleValidation.createFlashSaleZodSchema),
    flashSaleController.createFlashSaleController
);

router.patch(
    "/:id",
    upload.single("imageFile"),
    validateRequest(flashSaleValidation.updateFlashSaleZodSchema),
    flashSaleController.updateFlashSaleController
);

router.delete(
    "/:id",
    flashSaleController.deleteFlashSaleController
);

router.get(
    "/featured",
    flashSaleController.getFeaturedFlashSalesController
);

router.get(
    "/active",
    flashSaleController.getActiveFlashSalesController
);

router.get(
    "/:id",
    flashSaleController.getFlashSaleByIdController
);

router.get(
    "/",
    flashSaleController.getAllFlashSalesController
);

export const flashSaleRoutes = router;
