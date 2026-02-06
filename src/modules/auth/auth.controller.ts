import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  generateToken,
} from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const id = await createUser(name, email, password);

    res.json({ success: true, userId: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = await generateToken(user);

    res.json({ success: true, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
