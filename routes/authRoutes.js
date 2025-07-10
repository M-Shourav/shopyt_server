import { Router } from "express";
import {
  deleteUser,
  getAllUser,
  loginUser,
  registerUser,
  updateUser,
  userLogout,
} from "../controllers/adminControllers.js";
const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", userLogout);
router.post("/remove/:id", deleteUser);
router.get("/profile", getAllUser);
router.put("/update/:id", updateUser);

export default router;
