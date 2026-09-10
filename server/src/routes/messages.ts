import { Router, Request, Response } from "express";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// Public: Submit contact form message
router.post("/", (req: Request, res: Response) => {
  const { name, email, phone, subject, message, serviceInterest } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ success: false, message: "Nom, email et message requis." });
    return;
  }

  const newMsg = store.createMessage({
    name,
    email,
    phone: phone || "",
    subject: subject || "Demande de contact",
    message,
    serviceInterest
  });

  res.status(201).json({
    success: true,
    data: newMsg,
    message: "Votre message a été envoyé avec succès. Notre équipe vous répondra sous 24h."
  });
});

// Admin: Get all messages
router.get("/", requireAdminAuth, (req: Request, res: Response) => {
  const messages = store.getMessages();
  res.json({ success: true, data: messages });
});

// Admin: Update message status
router.patch("/:id/status", requireAdminAuth, (req: Request, res: Response) => {
  const { status } = req.body;
  const success = store.updateMessageStatus(req.params.id, status);
  if (!success) {
    res.status(404).json({ success: false, message: "Message non trouvé." });
    return;
  }
  res.json({ success: true, message: "Statut du message mis à jour." });
});

export default router;
