import { Role } from "./../enum/Role";
import { config } from "./../config/vars";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/types";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const payload = jwt.verify(token, config.accessTokenSecret) as UserPayload;
    req.currentUser = payload;
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  next();
};

export const requireRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser || req.currentUser.role !== role) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }
    next();
  };
};
