import express from "express";

import mongoose from "mongoose";
import { errors } from "celebrate";
import cardsRouter from "./routes/cards.js";
import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import auth from "./middlewares/auth.js";
import errorHandler from "./middlewares/errorHandler.js";
import { requestLogger, errorLogger } from "./middlewares/logger.js";

mongoose.connect("mongodb://localhost:27017/aroundb");

const app = express();
app.use(requestLogger);

app.use(express.json()); // para parsear application/json
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

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port  ${port}`);
});
