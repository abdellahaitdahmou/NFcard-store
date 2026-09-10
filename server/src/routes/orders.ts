import { Router, Request, Response } from "express";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";
import { OrderStatus } from "../models/types";

const router = Router();

// Public: Create order
router.post("/", (req: Request, res: Response) => {
  const {
    productOrPackName,
    productType,
    productId,
    quantity,
    unitPrice,
    totalPrice,
    paymentStatus,
    customerInfo
  } = req.body;

  if (!customerInfo || !customerInfo.fullName || !customerInfo.phone) {
    res.status(400).json({
      success: false,
      message: "Les informations de contact (Nom complet, Téléphone) sont obligatoires."
    });
    return;
  }

  const newOrder = store.createOrder({
    productOrPackName: productOrPackName || "NFC Card Business",
    productType: productType || "product",
    productId: productId || "prod-business",
    quantity: Number(quantity) || 1,
    unitPrice: Number(unitPrice) || 349,
    totalPrice: Number(totalPrice) || (Number(unitPrice) || 349) * (Number(quantity) || 1),
    paymentStatus: paymentStatus || "cash_on_delivery",
    customerInfo
  });

  res.status(201).json({
    success: true,
    data: newOrder,
    message: "Votre commande a été enregistrée avec succès !"
  });
});

// Admin: Get all orders
router.get("/", requireAdminAuth, (req: Request, res: Response) => {
  const orders = store.getOrders();
  res.json({ success: true, data: orders });
});

// Public or Admin: Get order details by ID or Number
router.get("/:id", (req: Request, res: Response) => {
  const order = store.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: "Commande introuvable." });
    return;
  }
  res.json({ success: true, data: order });
});

// Admin: Update order status
router.patch("/:id/status", requireAdminAuth, (req: Request, res: Response) => {
  const { status, note } = req.body;
  if (!status) {
    res.status(400).json({ success: false, message: "Statut manquant." });
    return;
  }

  const updated = store.updateOrderStatus(req.params.id, status as OrderStatus, note);
  if (!updated) {
    res.status(404).json({ success: false, message: "Commande introuvable." });
    return;
  }

  res.json({ success: true, data: updated });
});

// Admin: Add note to order
router.post("/:id/notes", requireAdminAuth, (req: Request, res: Response) => {
  const { note } = req.body;
  if (!note) {
    res.status(400).json({ success: false, message: "Texte de la note requis." });
    return;
  }

  const updated = store.addOrderNote(req.params.id, note);
  if (!updated) {
    res.status(404).json({ success: false, message: "Commande introuvable." });
    return;
  }

  res.json({ success: true, data: updated });
});

// Admin: Full update
router.put("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const updated = store.updateOrder(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: "Commande introuvable." });
    return;
  }
  res.json({ success: true, data: updated });
});

export default router;
