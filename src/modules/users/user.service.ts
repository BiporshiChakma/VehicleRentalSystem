import { pool } from "../../config/db";



const getUser = async()=>{
    const result = await pool.query(
  "SELECT id, name, email,phone, role FROM users"
);
    return result;
}

const updatAllUser = async(name:any,email:any,phone:any,role:any,id:any)=>{ 
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, phone = $3,role=$4 WHERE id = $5  RETURNING *`,
      [name,email,phone,role, id]
    );return result;};
const updatUser = async(name:any,email:any,phone:any,id:any)=>{ 
    const result = await pool.query(
      `UPDATE users SET name = $1,  email = $2, phone = $3 WHERE id = $4  RETURNING *`,
      [name,email,phone, id]
    );return result;};

const deleteUser = async(id:any)=>{
    const result =  await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *`,[id]
    );return result;
};

export const userService ={
  getUser,updatAllUser,updatUser,deleteUser
}