import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // references the Customer collection
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
