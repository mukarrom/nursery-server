import { Router } from "express";
import { upload } from "../../utils/multer";
import { testControllers } from "./tests.controller";

const router = Router();

router.get("/", testControllers.getTestData);
router.post("/create", upload.single("video"), testControllers.createTestData);

export const testRoutes = router;
