import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import customerRoutes from "./routes/customerRoutes";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/customers", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
