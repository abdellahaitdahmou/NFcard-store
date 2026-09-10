import { Router, Request, Response } from "express";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// Public: Get site settings
router.get("/", (req: Request, res: Response) => {
  const settings = store.getSettings();
  res.json({ success: true, data: settings });
});

// Admin: Update site settings
router.put("/", requireAdminAuth, (req: Request, res: Response) => {
  const updated = store.updateSettings(req.body);
  res.json({ success: true, data: updated });
});

export default router;
