import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User"; // 👈 remove .js extension in TS

const router = express.Router();

// 🧾 REGISTER
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      data: { id: newUser._id, email: newUser.email },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 🔐 LOGIN
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.json({
      data: { token, user: { id: user._id, email: user.email } },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
