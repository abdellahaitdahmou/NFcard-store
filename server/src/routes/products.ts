import { Router, Request, Response } from "express";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  const products = store.getProducts();
  res.json({ success: true, data: products });
});

router.get("/:id", (req: Request, res: Response) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  const product = store.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ success: false, message: "Produit non trouvé." });
    return;
  }
  res.json({ success: true, data: product });
});

router.post("/", requireAdminAuth, (req: Request, res: Response) => {
  const {
    name,
    slug,
    tagline,
    description,
    price,
    costPrice,
    comparePrice,
    stockQuantity,
    minStockAlert,
    sku,
    features,
    isPopular,
    category,
    badge,
    includedCardCount
  } = req.body;

  if (!name || price === undefined) {
    res.status(400).json({ success: false, message: "Nom et prix de vente sont requis." });
    return;
  }

  const newProd = store.createProduct({
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
    tagline: tagline || "",
    description: description || "",
    price: Number(price),
    costPrice: costPrice !== undefined && costPrice !== null && costPrice !== "" ? Number(costPrice) : undefined,
    comparePrice: comparePrice ? Number(comparePrice) : undefined,
    stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 0,
    minStockAlert: minStockAlert !== undefined ? Number(minStockAlert) : 5,
    sku: sku || undefined,
    features: Array.isArray(features) ? features : [],
    isPopular: Boolean(isPopular),
    category: category || "business",
    badge: badge || "",
    includedCardCount: Number(includedCardCount) || 1
  });

  res.status(201).json({ success: true, data: newProd });
});

router.put("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const updates = { ...req.body };

  // Normalize numbers if present
  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.costPrice !== undefined) {
    updates.costPrice = updates.costPrice !== null && updates.costPrice !== "" ? Number(updates.costPrice) : undefined;
  }
  if (updates.comparePrice !== undefined) {
    updates.comparePrice = updates.comparePrice ? Number(updates.comparePrice) : undefined;
  }
  if (updates.stockQuantity !== undefined) updates.stockQuantity = Math.max(0, Number(updates.stockQuantity));
  if (updates.minStockAlert !== undefined) updates.minStockAlert = Math.max(0, Number(updates.minStockAlert));

  const updated = store.updateProduct(req.params.id, updates);
  if (!updated) {
    res.status(404).json({ success: false, message: "Produit non trouvé." });
    return;
  }
  res.json({ success: true, data: updated });
});

// Quick Stock Adjust: PATCH /api/products/:id/stock
router.patch("/:id/stock", requireAdminAuth, (req: Request, res: Response) => {
  const { quantity, delta } = req.body;
  const product = store.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ success: false, message: "Produit non trouvé." });
    return;
  }

  let newStock = product.stockQuantity || 0;
  if (quantity !== undefined) {
    newStock = Math.max(0, Number(quantity));
  } else if (delta !== undefined) {
    newStock = Math.max(0, newStock + Number(delta));
  }

  const updated = store.updateProduct(req.params.id, { stockQuantity: newStock });
  res.json({
    success: true,
    data: updated,
    message: `Stock mis à jour avec succès (${newStock} unités).`
  });
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
