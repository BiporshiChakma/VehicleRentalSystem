import { pool } from "../../config/db";
import { QueryResult } from "pg";


const addVehicles = async(vehicle_name:any, type:any,  registration_number:any,daily_rent_price:any)=>{
    const result = await pool.query(
          `INSERT INTO vehicles(vehicle_name, type,  registration_number,daily_rent_price) VALUES($1,$2,$3,$4) RETURNING *`,
          [vehicle_name, type,  registration_number,daily_rent_price]
        );
        return result;
};

const getVehicles = async()=>{
    const result = await pool.query("SELECT * FROM vehicles");
    return result;
}

const singleVehicle = async(vehicleId:any)=>{
    const result =  await pool.query(
      `SELECT * FROM vehicles WHERE id = $1`,
      [vehicleId]
    );
    return result;
};
const updateVehicle = async ( id: any,vehicle_name: string,type: string,registration_number: string,daily_rent_price:string
) => {
  const result = await pool.query(
    `UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3,daily_rent_price=$4 updated_at = NOW() WHERE id = $5 RETURNING *`,
    [vehicle_name, type, registration_number,daily_rent_price, id]
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