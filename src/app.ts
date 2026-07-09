import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/auth";
import campaignsRouter from "./routes/campaigns";
import statsRouter from "./routes/stats";
import { volunteerByIdRouter } from "./routes/volunteers";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(process.env.NODE_ENV === "test" ? "silent" : "dev"));

  // Basic abuse protection — generous enough for a live demo, tight enough to matter.
  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 });
  app.use("/api", limiter);

  app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

  app.use("/api/auth", authRouter);
  app.use("/api/campaigns", campaignsRouter);
  app.use("/api/volunteers", volunteerByIdRouter);
  app.use("/api/stats", statsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
