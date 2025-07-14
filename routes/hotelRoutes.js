import { Router } from "express";
import {
  createHotel,
  deleteHotel,
  getHotel,
  singleHotel,
  updateHotel,
} from "../controllers/hotelController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const hotelRouter = Router();

hotelRouter.post(
  "/hotel",
  // protect,
  // adminOnly,
  upload.array("avatar", 3),
  createHotel
);
hotelRouter.post("/remove/:id", deleteHotel);
hotelRouter.put(
  "/update/:id",
  protect,
  adminOnly,
  upload.array("avatar", 3),
  updateHotel
);
hotelRouter.get("/getHotels", getHotel);
hotelRouter.get("/getHotelsById/:slug", singleHotel);

export default hotelRouter;
