import { Router, Request, Response } from "express";
import { upload } from "../middleware/upload";

const router = Router();

// Upload single file (logo, avatar, old card photo)
router.post("/", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: "Aucun fichier reçu." });
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// Upload multiple files (portfolio, products)
router.post("/multiple", upload.array("files", 10), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ success: false, message: "Aucun fichier reçu." });
    return;
  }

  const fileUrls = files.map((f) => ({
    fileUrl: `/uploads/${f.filename}`,
    filename: f.filename,
    originalName: f.originalname
  }));

  res.json({ success: true, files: fileUrls });
});

export default router;
