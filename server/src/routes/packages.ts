import { Router, Request, Response } from "express";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const packages = store.getPackages();
  res.json({ success: true, data: packages });
});

router.get("/:id", (req: Request, res: Response) => {
  const pkg = store.getPackageById(req.params.id);
  if (!pkg) {
    res.status(404).json({ success: false, message: "Pack non trouvé." });
    return;
  }
  res.json({ success: true, data: pkg });
});

router.post("/", requireAdminAuth, (req: Request, res: Response) => {
  const { name, slug, businessType, tagline, description, price, features, icon, badge, idealFor } = req.body;
  if (!name || !price) {
    res.status(400).json({ success: false, message: "Nom et prix sont requis." });
    return;
  }

  const newPkg = store.createPackage({
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
    businessType: businessType || "custom",
    tagline: tagline || "",
    description: description || "",
    price: Number(price),
    features: Array.isArray(features) ? features : [],
    icon: icon || "Briefcase",
    badge: badge || "",
    idealFor: idealFor || ""
  });

  res.status(201).json({ success: true, data: newPkg });
});

router.put("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const updated = store.updatePackage(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: "Pack non trouvé." });
    return;
  }
  res.json({ success: true, data: updated });
});

router.delete("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const deleted = store.deletePackage(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Pack non trouvé." });
    return;
  }
  res.json({ success: true, message: "Pack supprimé avec succès." });
});

export default router;
