import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
