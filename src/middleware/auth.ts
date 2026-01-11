import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

/** Custom Request interface */
export interface CustomRequest extends Request {
  User?: JwtPayload;
}

const auth = (...roles: string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token missing" });
      }
      const decode = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;

      req.User = decode;

      if (roles.length && !roles.includes(decode.role as string)) {
        return res.status(403).json({
          error: "Unauthorized access",
        });
      }

      next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default auth;
