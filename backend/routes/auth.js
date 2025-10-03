import { Router } from "express";
import { login, register } from "../controllers/users.js";
import { validateRegister, validateLogin } from "../middlewares/validation.js";

const router = Router();

router.post("/signin", login, validateLogin);
router.post("/signup", register, validateRegister);

export default router;
