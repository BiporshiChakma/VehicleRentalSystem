import { pool } from "../../config/db";
import { QueryResult } from "pg";

 
const addVehicles = async(vehicle_name:any, type:any,  registration_number:any,daily_rent_price:any,availability_status:any)=>{
    const result = await pool.query(
          `INSERT INTO vehicles(vehicle_name, type,  registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`,
          [vehicle_name, type,  registration_number,daily_rent_price,availability_status]
        );
        return result;
};

const getVehicles = async()=>{
    const result = await pool.query("SELECT * FROM vehicles");
    return result.rows;
}

const singleVehicle = async(vehicleId:any)=>{
    const result =  await pool.query(
      `SELECT * FROM vehicles WHERE id = $1`,
      [vehicleId]
    );
    return result;
};
const updateVehicle = async ( id: any,vehicle_name: string,type: string,registration_number: string,
  daily_rent_price:string, availability_status:any

) => {
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3,daily_rent_price=$4,availability_status=$5,  updated_at = NOW() WHERE id = $6 RETURNING *`,
    [vehicle_name, type, registration_number,daily_rent_price,availability_status, id]
  );

  return result;
};
const deleteVehicle = async(vehicleId:any)=>{
  const result = await pool.query(
      `DELETE FROM vehicles WHERE id = $1 RETURNING *`,[vehicleId]
    );
    return result;
}


export const vehicleService = {
    addVehicles,getVehicles,singleVehicle,updateVehicle,deleteVehicle
}