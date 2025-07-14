import multer from "multer";
import { Storage } from "../config/cloudinary.js";

const upload = multer({ storage: Storage });
export default upload;
