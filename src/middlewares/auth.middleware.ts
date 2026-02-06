import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redis from "../config/redis";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const authMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const session = await redis.get(`session:${decoded.id}`);
    if (!session) return res.status(401).json({ error: "Session expired" });

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
