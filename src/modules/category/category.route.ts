import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/multer";
import { categoryController } from "./category.controller";
import { categoryValidation } from "./category.validation";

const router = express.Router();

router.post(
    "/",
    upload.single("image"),
    validateRequest(categoryValidation.createCategoryZodSchema),
    categoryController.createCategoryController
);

router.patch(
    "/:id",
    upload.single("image"),
    validateRequest(categoryValidation.updateCategoryZodSchema),
    categoryController.updateCategoryController
);

router.delete(
    "/:id",
    categoryController.deleteCategoryController
);

router.get(
    "/:id",
    categoryController.getCategoryByIdController
);

router.get(
    "/",
    categoryController.getAllCategoriesController
);

export const categoryRoutes = router;
