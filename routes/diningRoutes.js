import { Router } from "express";
import upload from "../middleware/multer.js";
import {
  createDining,
  deleteDining,
  getallDining,
  singleDining,
  updateDining,
} from "../controllers/diningController.js";

const diningRouter = Router();

diningRouter.post("/ding", upload.single("avatar"), createDining);
diningRouter.post("/delete/:id", deleteDining);
diningRouter.put("/dinings/:slug", updateDining);
diningRouter.get("/single/:slug", singleDining);
diningRouter.get("/getDining", getallDining);

export default diningRouter;
