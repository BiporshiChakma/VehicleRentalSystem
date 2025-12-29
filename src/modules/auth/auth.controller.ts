import { authService } from "./auth.service"
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const singup = async (req: Request, res: Response) => {
  const { name,role, email, password,phone } = req.body;

  const hashedPass = await bcrypt.hash(password as string,10);

  try {
    const result = await authService.createUser(name,role,email,hashedPass,phone);

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
const loginUser = async(req:Request, res: Response)=>{
    const {email,password} = req.body;
      try {
        const result = await authService.loginUser(email,password);
        res.status(200).json({
          success:true,
          message: "login successful",
          data: result
      });}
       catch (err:any) {
        res.status(500).json({
          success: false,
          message: err.message,
        });
      };
}

export const authController = {
singup,loginUser
}
