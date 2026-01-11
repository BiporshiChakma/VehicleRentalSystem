 import express, {Request,Response} from "express";
import { vehicleController } from "./vehicles.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";
 
 const router = express.Router();
 
router.post("/",logger,auth("admin"),vehicleController.addVehicles);
router.get("/",logger,auth(),vehicleController.getVehicles);
router.get("/:vehicleId",logger,auth(),vehicleController.singleVehicle);
router.put("/:vehicleId",logger,auth("admin"),vehicleController.updateVehicle);
router.delete("/:vehicleId",logger,auth("admin"),vehicleController.deleteVehicle);
export const vehicleRoute = router;  