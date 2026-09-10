import { Router, Request, Response } from "express";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// Public: Track interaction event
router.post("/track", (req: Request, res: Response) => {
  const { profileSlug, eventType, platform, city, metadata } = req.body;
  if (!profileSlug || !eventType) {
    res.status(400).json({ success: false, message: "profileSlug et eventType requis." });
    return;
  }

  // Update specific metric counter on profile if applicable
  if (eventType === "whatsapp_click") store.incrementProfileMetric(profileSlug, "whatsapp");
  if (eventType === "call_click") store.incrementProfileMetric(profileSlug, "call");
  if (eventType === "vcard_save") store.incrementProfileMetric(profileSlug, "vcard");
  if (eventType === "qr_scan") store.incrementProfileMetric(profileSlug, "qr");
  if (eventType === "nfc_tap") store.incrementProfileMetric(profileSlug, "nfc");

  const evt = store.trackEvent({
    profileSlug,
    eventType,
    platform: platform || "Web Browser",
    city: city || "Maroc",
    metadata
  });

  res.json({ success: true, data: evt });
});

// Admin: Get statistics summary
router.get("/summary", requireAdminAuth, (req: Request, res: Response) => {
  const summary = store.getAnalyticsSummary();
  res.json({ success: true, data: summary });
});

export default router;
