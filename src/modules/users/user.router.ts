import express, {Request,Response} from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";
const router = express.Router();

router.get("/",logger,auth("admin"),userController.getAllUser);
router.put("/:id",logger,auth("admin","user"),userController.updateUsers);
router.delete("/:id",logger,auth("admin"),userController.deleteUsers);

export const userRoutes = router; 