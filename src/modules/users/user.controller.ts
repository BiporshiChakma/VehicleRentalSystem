import express, {Request,Response} from "express";
import { userService } from "./user.service";

  const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error
    });
  }
};

const updateUsers = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name,  email, phone, role} = req.body;

  try {
    if ( 
      req.User?.role === "customer" &&
      req.User.id !== id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own account",
      });
    }

    let result;

    if (req.User?.role === "admin") {
      result = await userService.updatAllUser( name,email, phone, role,id);
    } else {
      result = await userService.updatUser(name, email, phone, id);
    }

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
      const rest = result.rows[0];
    res.status(200).json({
      success: true,
      message: "User updated successfully",
    data:{
      ...rest,
       created_at: new Date(rest.created_at).toISOString().slice(0, 10),
    updated_at: new Date(rest.updated_at).toISOString().slice(0, 10),
    }
     
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteUsers = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUser(id);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

  export const userController = {
    getAllUser,updateUsers,deleteUsers
  }