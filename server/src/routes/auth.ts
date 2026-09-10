import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { store } from "../services/store";
import { requireAdminAuth, AuthRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_nfc_morocco_key_2026_jwt_token";

router.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email et mot de passe requis." });
    return;
  }

  const admin = store.getAdminByEmail(email);
  if (!admin) {
    res.status(401).json({ success: false, message: "Identifiants invalides." });
    return;
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    res.status(401).json({ success: false, message: "Identifiants invalides." });
    return;
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    user: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  });
});

router.get("/me", requireAdminAuth, (req: AuthRequest, res: Response) => {
  res.json({ success: true, user: req.user });
});

router.put("/password", requireAdminAuth, (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ success: false, message: "Tous les champs sont requis." });
    return;
  }

  const admin = store.getAdminByEmail(req.user!.email);
  if (!admin || !bcrypt.compareSync(currentPassword, admin.passwordHash)) {
    res.status(400).json({ success: false, message: "Mot de passe actuel incorrect." });
    return;
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  store.updateAdminPassword(admin.id, newHash);
  res.json({ success: true, message: "Mot de passe mis à jour avec succès." });
});

export default router;
