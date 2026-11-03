import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();

// Security headers
app.use(helmet());

// CORS policy
const allowedOrigins = env.CORS_ORIGIN.split(",").map(
  (origin) => origin.trim()
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Native mobile apps may not send an Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
  })
);

// Request logging
app.use(morgan("dev"));

// Parse JSON request bodies
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HRMS API is running"
  });
});

// 404 and centralized error handling
app.use(notFound);
app.use(errorHandler);

export default app;