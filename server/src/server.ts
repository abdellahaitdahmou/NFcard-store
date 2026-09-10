import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import packagesRouter from "./routes/packages";
import ordersRouter from "./routes/orders";
import profilesRouter from "./routes/profiles";
import cardsRouter from "./routes/cards";
import competitorsRouter from "./routes/competitors";
import analyticsRouter from "./routes/analytics";
import settingsRouter from "./routes/settings";
import messagesRouter from "./routes/messages";
import uploadsRouter from "./routes/uploads";
import { store } from "./services/store";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Static uploads
const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/packages", packagesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/competitors", competitorsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/upload", uploadsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    company: "Tektap NFC Maroc",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Card direct tap redirection helper (for physical NFC tags pointing directly to /card/xyz)
app.get("/card/:slug", (req, res) => {
  const card = store.getCardBySlug(req.params.slug);
  const clientBaseUrl = process.env.SITE_URL || "http://localhost:5173";

  if (card && card.status === "active") {
    store.incrementCardTap(card.cardSlug);
    store.incrementProfileMetric(card.targetProfileSlug, "nfc");
    res.redirect(`${clientBaseUrl}/p/${card.targetProfileSlug}`);
  } else {
    res.redirect(`${clientBaseUrl}/demo`);
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route API non trouvée." });
});

// Start server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🇲🇦 Tektap NFC Maroc Server running on port ${PORT}`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
