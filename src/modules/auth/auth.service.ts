import { pool } from "../../config/db"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import config from "../../config";


const createUser = async(name:any,role:any,email:any,hashedPass:any,phone:any)=>{
    const result = await pool.query(
          `INSERT INTO users(name,role,email,password,phone) VALUES($1,$2,$3,$4,$5) RETURNING *`,
          [name,role, email, hashedPass,phone]
        );
        return result;
}
const loginUser = async(email: string, password:string)=>{
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
    if(result.rows.length === 0){
        return null;
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return false;
    }
    
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email,role: user.role},config.jwtSecret as string,{
        expiresIn: "7d",
    });
    return {token,user};
};

export const authService ={
    loginUser,createUser
} 
