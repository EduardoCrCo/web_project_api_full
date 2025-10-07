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

dotenv.config();

const {
  PORT = 3000,
  MONGO_URL = "mongodb://127.0.0.1:27017/aroundb",
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

const allowedOrigins = [
  "http://localhost:3000",
  "https://web-project-around.ignorelist.com",
  "https://www.web-project-around.ignorelist.com",
  "https://api.web-project-around.ignorelist.com",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, OPTIONS, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200).end();
  }

  next();
});

app.use(requestLogger);
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});

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
