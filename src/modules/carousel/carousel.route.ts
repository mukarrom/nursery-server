import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/multer";
import { carouselController } from "./carousel.controller";
import { carouselValidation } from "./carousel.validation";

const router = express.Router();

router.post(
    "/",
    upload.single("imageFile"),
    validateRequest(carouselValidation.createCarouselZodSchema),
    carouselController.createCarouselController
);

router.patch(
    "/:id",
    upload.single("imageFile"),
    validateRequest(carouselValidation.updateCarouselZodSchema),
    carouselController.updateCarouselController
);

router.delete(
    "/:id",
    carouselController.deleteCarouselController
);

router.get(
    "/active",
    carouselController.getActiveCarouselsController
);

router.get(
    "/:id",
    carouselController.getCarouselByIdController
);

router.get(
    "/",
    carouselController.getAllCarouselsController
);

export const carouselRoutes = router;
