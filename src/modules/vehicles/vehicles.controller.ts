import express, {Request,Response} from "express";
import { pool } from "../../config/db";
import { vehicleService } from "./vehicles.service";

const addVehicles = 
    async (req: Request, res: Response) => {
      const { vehicle_name, type,  registration_number, daily_rent_price} = req.body;
    
      try {
        const result = await vehicleService.addVehicles(vehicle_name, type,  registration_number,daily_rent_price);
    
        res.status(201).json({
          success: true,
          user: result.rows[0],
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
 
     res.status(200).json({
       success: true,
       data: result.rows
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
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
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
  const { vehicle_name, type, registration_number,daily_rent_price } = req.body;

  try {
    const result = await vehicleService.updateVehicle(vehicleId, vehicle_name,type, registration_number,daily_rent_price);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
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
      data: result.rows[0],
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