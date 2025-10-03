import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { errors } from "celebrate";
// import helmet from "helmet";
// import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cardsRouter from "./routes/cards.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import auth from "./middlewares/auth.js";
import errorHandler from "./middlewares/errorHandler.js";
import { requestLogger, errorLogger } from "./middlewares/logger.js";

dotenv.config();

const {
  PORT = 3000,
  MONGO_URL = "mongodb://127.0.0.1:27017/aroundb",
  ALLOWED_ORIGINS = "http://localhost:3000",
  NODE_ENV = "development",
} = process.env;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    if (NODE_ENV !== "test") console.log("MongoDB conectado");
  })
  .catch((err) => {
    console.error("Error conexión Mongo:", err);
    process.exit(1);
  });

// const allowedOrigins = ALLOWED_ORIGINS.split(",")
//   .map((o) => o.trim())
//   .filter(Boolean);

const app = express();

app.use(
  cors({
    origin: ALLOWED_ORIGINS.split(",")
      .map((o) => o.trim())
      .filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("/api/users", cors());

app.use((err, req, res, next) => {
  if (err && err.message === "CORS_NOT_ALLOWED") {
    return res.status(403).json({ message: "Origin not allowed by CORS" });
  }
  return next(err);
});

// app.use(helmet());

// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 15,
//   message: { message: "Demasiados intentos. Intenta más tarde." },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// app.use(globalLimiter);

app.use(requestLogger);
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

//app.post("/signin", );
//app.post("/signup", );

app.use(authRouter);
app.use(auth);
app.use(cardsRouter);
app.use(usersRouter);

app.use("/", (req, res) => {
  res.status(404).send({
    message: "Endpoint not found",
  });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
