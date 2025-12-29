import { Router } from "express";
import { authController } from "./auth.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = Router();
router.post("/signup",logger,authController.singup)
router.get("/login",logger,authController.loginUser);

export const authRoutes = router;