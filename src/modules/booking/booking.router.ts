import express, {Request,Response} from "express";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";
import { bookingController } from "./booking.controller";

const router = express.Router();

router.post("/",logger,auth(),bookingController.booking);
router.get("/", logger, auth("admin", "user"), bookingController.getBookings);
router.put("/:id", logger, auth("admin", "user"), bookingController.updateBooking);
export const bookingRoutes = router;  