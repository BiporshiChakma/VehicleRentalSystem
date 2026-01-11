import express, {Request,Response} from "express";
import { pool } from "../../config/db";
import { vehicleService } from "./vehicles.service";

const addVehicles = 
    async (req: Request, res: Response) => {
      const { vehicle_name, type,  registration_number, daily_rent_price,availability_status} = req.body;
     let status: boolean;

    if (availability_status === "available") {
    status = true;
      } else if (availability_status === "booked") {
      status = false;
    } else {
   return res.status(400).json({
    success: false,
    message: "Validation error: availability_status must be 'available' or 'booked'",
  });
}
     // console.log("hello=",status)
      try {
        const result = await vehicleService.addVehicles(vehicle_name, type,  registration_number,daily_rent_price,status);
    
       const vehicle = result.rows[0];

res.status(201).json({
  success: true,
  message: "Vehicle Created Successfully",
  user: {
    ...vehicle,
    availability_status: vehicle.availability_status
      ? "available"
      : "booked",
  },
});
      } catch (err) {
        console.error(err); 
        res.status(500).json({
          success: false,
          message: "Failed to create user",
        });
      }};

const getVehicles = 
  async (req: Request, res: Response) => {
   try {
     const result = await vehicleService.getVehicles();
         if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicle found",
        data: [],
      });
    }

 
        
       const vehicle: any[]  = result;
      // const vehicled = result.rows

const formattedBookings = await Promise.all(
  vehicle.map(async (v) => ({
     ...v,
  availability_status: v.availability_status ? "available" : "booked",
    created_at: new Date(v.created_at).toISOString().slice(0, 10),
    updated_at: new Date(v.updated_at).toISOString().slice(0, 10),
  })))
res.status(201).json({
  success: true,
  message: "Vehicle retrieved successfully",
  data: formattedBookings
});
   } catch (error) {
     res.status(500).json({
       success: false,
       message: "Failed to fetch vehicles",
       error
     });
   }
 };

const singleVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;

  try {
    const result = await vehicleService.singleVehicle(vehicleId);

        if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicle found",
        data: [],
      });
    }

       const vehicle = result.rows[0];

res.status(201).json({
  success: true,
  message: "Vehicle retrieved successfully",
  data: {
    ...vehicle,
    availability_status: vehicle.availability_status
      ? "available"
      : "booked",
       created_at: new Date(vehicle.created_at).toISOString().slice(0, 10),
    updated_at: new Date(vehicle.updated_at).toISOString().slice(0, 10),
  },
});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
      error,
    });
  }
};


const updateVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const { vehicle_name, type, registration_number,daily_rent_price, availability_status} = req.body;
   let status: boolean;

    if (availability_status === "available") {
    status = true;
      } else if (availability_status === "booked") {
      status = false;
    } else {
   return res.status(400).json({
    success: false,
    message: "Validation error: availability_status must be 'available' or 'booked'",
  });
}

  try {
    const result = await vehicleService.updateVehicle(vehicleId, vehicle_name,type, registration_number,daily_rent_price,status);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

       const vehicle = result.rows[0];

res.status(201).json({
  success: true,
  message: "Vehicle update successfully",
  data: {
    ...vehicle,
    availability_status: vehicle.availability_status
      ? "available"
      : "booked",
        created_at: new Date(vehicle.created_at).toISOString().slice(0, 10),
    updated_at: new Date(vehicle.updated_at).toISOString().slice(0, 10),
  },
});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const deleteVehicle = async (req: Request, res: Response) => {
 const { vehicleId } = req.params;

  try {
    const result = await vehicleService.deleteVehicle(vehicleId);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicles not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const vehicleController = {
    addVehicles,getVehicles,singleVehicle,updateVehicle,deleteVehicle
}