import { Router } from "express";
import {
  getAllUser,
  loginUser,
  registerUser,
} from "../controllers/adminControllers.js";
const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/profile", getAllUser);

export default router;
