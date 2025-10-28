import express, { Request, Response } from "express";
import Customer from "../models/Customer"; // remove `.js` for TS imports
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// ➕ Create new customer (only for logged-in users)
router.post("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ data: customer });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get all customers (with pagination)
router.get("/",authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const skip = (page - 1) * pageSize;
    const total = await Customer.countDocuments();
    const customers = await Customer.find().skip(skip).limit(pageSize);

    res.json({
      data: customers,
      meta: { page, pageSize, total },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 🧾 Get single customer
router.get("/:id",authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json({ data: customer });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ✏️ Update customer
router.put("/:id",authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete customer
router.delete("/:id",authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ data: "Customer deleted successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
