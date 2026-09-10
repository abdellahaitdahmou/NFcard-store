import { Router, Request, Response } from "express";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const products = store.getProducts();
  res.json({ success: true, data: products });
});

router.get("/:id", (req: Request, res: Response) => {
  const product = store.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ success: false, message: "Produit non trouvé." });
    return;
  }
  res.json({ success: true, data: product });
});

router.post("/", requireAdminAuth, (req: Request, res: Response) => {
  const { name, slug, tagline, description, price, comparePrice, features, isPopular, category, badge, includedCardCount } = req.body;
  if (!name || !price) {
    res.status(400).json({ success: false, message: "Nom et prix sont requis." });
    return;
  }

  const newProd = store.createProduct({
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
    tagline: tagline || "",
    description: description || "",
    price: Number(price),
    comparePrice: comparePrice ? Number(comparePrice) : undefined,
    features: Array.isArray(features) ? features : [],
    isPopular: Boolean(isPopular),
    category: category || "business",
    badge: badge || "",
    includedCardCount: Number(includedCardCount) || 1
  });

  res.status(201).json({ success: true, data: newProd });
});

router.put("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const updated = store.updateProduct(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: "Produit non trouvé." });
    return;
  }
  res.json({ success: true, data: updated });
});

router.delete("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const deleted = store.deleteProduct(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Produit non trouvé." });
    return;
  }
  res.json({ success: true, message: "Produit supprimé avec succès." });
});

export default router;
