import { Router } from "express";
import {
  deleteUser,
  getAllUser,
  loginUser,
  registerUser,
  updateUser,
  userLogout,
} from "../controllers/adminControllers.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = Router();

router.post("/login", loginUser);
router.post("/register", upload.single("avatar"), registerUser);
router.post("/logout", protect, userLogout);
router.post("/remove/:id", protect, adminOnly, deleteUser);
router.get("/profile", protect, adminOnly, getAllUser);
router.put("/update/:id", upload.single("avatar"), protect, updateUser);

export default router;
