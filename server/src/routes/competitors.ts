import { Router, Request, Response } from "express";
import { store } from "../services/store";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// Admin: List all competitor benchmarks
router.get("/", requireAdminAuth, (req: Request, res: Response) => {
  const competitors = store.getCompetitors();
  res.json({ success: true, data: competitors });
});

// Admin: Add competitor research entry
router.post("/", requireAdminAuth, (req: Request, res: Response) => {
  const {
    companyName,
    website,
    instagram,
    facebook,
    product,
    price,
    packageDetails,
    targetCustomer,
    advantages,
    weaknesses,
    notes,
    dateResearched,
    isVerified
  } = req.body;

  if (!companyName || !product) {
    res.status(400).json({
      success: false,
      message: "Nom de l'entreprise et type de produit sont obligatoires."
    });
    return;
  }

  const newComp = store.createCompetitor({
    companyName,
    website: website || "",
    instagram: instagram || "",
    facebook: facebook || "",
    product: product || "Cartes NFC",
    price: price || "N/A",
    packageDetails: packageDetails || "",
    targetCustomer: targetCustomer || "Tous professionnels",
    advantages: advantages || "",
    weaknesses: weaknesses || "",
    notes: notes || "",
    dateResearched: dateResearched || new Date().toISOString().split("T")[0],
    isVerified: isVerified !== undefined ? Boolean(isVerified) : true
  });

  res.status(201).json({ success: true, data: newComp });
});

// Admin: Update competitor
router.put("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const updated = store.updateCompetitor(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: "Enregistrement non trouvé." });
    return;
  }
  res.json({ success: true, data: updated });
});

// Admin: Delete competitor
router.delete("/:id", requireAdminAuth, (req: Request, res: Response) => {
  const deleted = store.deleteCompetitor(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, message: "Enregistrement non trouvé." });
    return;
  }
  res.json({ success: true, message: "Enregistrement supprimé avec succès." });
});

export default router;
