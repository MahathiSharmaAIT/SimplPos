import express, { Request, Response } from "express";
import Order from "../models/Order";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * 🟢 CREATE a new order
 * POST /api/orders
 */
router.post("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ message: "Order created successfully", data: order });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * 🔵 READ all orders (with optional pagination)
 * GET /api/orders?page=1&pageSize=10
 */
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const skip = (page - 1) * pageSize;
    const total = await Order.countDocuments();
    const orders = await Order.find()
      .populate("customer")
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    res.json({
      data: orders,
      meta: { total, page, pageSize },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🟣 READ single order by ID
 * GET /api/orders/:id
 */
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate("customer");
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🟠 UPDATE an order
 * PUT /api/orders/:id
 */
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ message: "Order updated successfully", data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * 🔴 DELETE an order
 * DELETE /api/orders/:id
 */
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
