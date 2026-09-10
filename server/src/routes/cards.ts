import { Router, Request, Response } from "express";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// Public: Resolve NFC card
router.get("/:slug", (req: Request, res: Response) => {
  const card = store.getCardBySlug(req.params.slug);
  if (!card) {
    res.status(404).json({ success: false, message: "Carte NFC non reconnue ou non enregistrée." });
    return;
  }

  if (card.status !== "active") {
    res.status(403).json({
      success: false,
      message: "Cette carte NFC est en attente d'activation ou désactivée."
    });
    return;
  }

  // Increment tap count
  store.incrementCardTap(req.params.slug);
  store.incrementProfileMetric(card.targetProfileSlug, "nfc");

  // Return target profile slug and URL for redirection
  const siteUrl = process.env.SITE_URL || "http://localhost:5173";
  res.json({
    success: true,
    data: {
      cardUid: card.uid,
      targetProfileSlug: card.targetProfileSlug,
      redirectUrl: `${siteUrl}/p/${card.targetProfileSlug}`,
      customerName: card.customerName
    }
  });
});

// Admin: Get all cards
router.get("/", requireAdminAuth, (req: Request, res: Response) => {
  const cards = store.getCards();
  res.json({ success: true, data: cards });
});

// Admin: Create card
router.post("/", requireAdminAuth, (req: Request, res: Response) => {
  const { uid, cardSlug, targetProfileSlug, customerName, status, orderNumber, notes } = req.body;
  if (!uid || !targetProfileSlug || !customerName) {
    res.status(400).json({
      success: false,
      message: "UID, Profil cible et Nom du client sont obligatoires."
    });
    return;
  }

  const newCard = store.createCard({
    uid,
    cardSlug: cardSlug || uid.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
    targetProfileSlug,
    customerName,
    status: status || "active",
    orderNumber,
    activationDate: new Date().toISOString().split("T")[0],
    notes
  });

  res.status(201).json({ success: true, data: newCard });
});

// Admin: Update card
router.put("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const updated = store.updateCard(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: "Carte non trouvée." });
    return;
  }
  res.json({ success: true, data: updated });
});

// Admin: Delete card
router.delete("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const deleted = store.deleteCard(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Carte non trouvée." });
    return;
  }
  res.json({ success: true, message: "Carte supprimée avec succès." });
});

export default router;
