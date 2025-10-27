import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true }, // e.g., Dairy, Bakery, Produce
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0 }, // optional
    unit: { type: String, default: "pcs" }, // e.g., pcs, kg, L
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
