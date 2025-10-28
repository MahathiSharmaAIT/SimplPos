import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
      index: true,  
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      default: "N/A",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false } // disables __v field
);

// create compound index (if needed)
customerSchema.index({ name: 1, email: 1 });

export default mongoose.model("Customer", customerSchema);
