import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { errors } from "celebrate";
import dotenv from "dotenv";
import cardsRouter from "./routes/cards.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import auth from "./middlewares/auth.js";
import errorHandler from "./middlewares/errorHandler.js";
import { requestLogger, errorLogger } from "./middlewares/logger.js";
import { whitelist } from "validator";

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

const app = express();

whitelist(ALLOWED_ORIGINS);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://web-project-around.ignorelist.com",
      "https://www.web-project-around.ignorelist.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

// app.use((err, req, res, next) => {
//   if (err && err.message === "CORS_NOT_ALLOWED") {
//     return res.status(403).json({ message: "Origin not allowed by CORS" });
//   }
//   return next(err);
// });

app.use(requestLogger);
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

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
