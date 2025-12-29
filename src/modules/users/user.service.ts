import { pool } from "../../config/db";



const getUser = async()=>{
    const result = await pool.query("SELECT * FROM users");
    return result;
}

const updatAllUser = async(name:any,role:any,password:any,phone:any,id:any)=>{ 
    const result = await pool.query(
      `UPDATE users SET name = $1, role = $2,  password = $3, phone = $4 WHERE id = $5  RETURNING *`,
      [name,role,password,phone, id]
    );return result;};
const updatUser = async(name:any,password:any,phone:any,id:any)=>{ 
    const result = await pool.query(
      `UPDATE users SET name = $1,  password = $2, phone = $3 WHERE id = $4  RETURNING *`,
      [name,  password,phone, id]
    );return result;};

const deleteUser = async(id:any)=>{
    const result =  await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,[id]
    );return result;
};

export const userService ={
  getUser,updatAllUser,updatUser,deleteUser
}