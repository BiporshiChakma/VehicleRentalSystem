import express, {Request,Response} from "express";
import initDB, {pool} from "./config/db";
import { userRoutes } from "./modules/users/user.router";
import { vehicleRoute } from "./modules/vehicles/vehicles.router";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingRoutes } from "./modules/booking/booking.router";
import logger from "./middleware/logger";


const app = express();


app.use(express.json());
initDB();

app.get("/",logger,(req:Request, res:Response)=>{
    res.send("hello from server");
})
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/vehicles",vehicleRoute);
app.use("/api/v1/bookings",bookingRoutes);

app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message: "Route Not Found",
        path: req.path
    })
})

export default app;