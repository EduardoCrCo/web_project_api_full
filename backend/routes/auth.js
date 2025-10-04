import { Router } from "express";
import { login, register } from "../controllers/users.js";
import { validateRegister, validateLogin } from "../middlewares/validation.js";

const router = Router();

router.post("/login", validateLogin, login);
router.post("/register", validateRegister, register);

export default router;
