import express from "express";
import { USER_ROLE } from "../../constants/status.constants";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/multer";
import { carouselController } from "./carousel.controller";
import { carouselValidation } from "./carousel.validation";

const router = express.Router();

router.post(
    "/",
    upload.single("image"),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(carouselValidation.createCarouselZodSchema),
    carouselController.createCarouselController
);

router.patch(
    "/:id",
    upload.single("image"),
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    validateRequest(carouselValidation.updateCarouselZodSchema),
    carouselController.updateCarouselController
);

router.delete(
    "/:id",
    auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    carouselController.deleteCarouselController
);

router.get(
    "/active",
    auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    carouselController.getActiveCarouselsController
);

router.get(
    "/:id",
    auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    carouselController.getCarouselByIdController
);

router.get(
    "/",
    auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
    carouselController.getAllCarouselsController
);

export const carouselRoutes = router;
