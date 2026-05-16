import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { bookingsRouter } from "./modules/bookings/booking.routes.js";
import { servicesRouter } from "./modules/services/service.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "elegant-beauty-suite-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

app.use(errorHandler);
