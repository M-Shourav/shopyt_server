import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // verify token
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // get user without password
    const user = await userModel.findById(decode.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized", error: error?.message });
  }
};

export const adminOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
