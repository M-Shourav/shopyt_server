import asyncHandler from "express-async-handler";
import diningModel from "../models/diningModel.js";
import cloudinary from "../config/cloudinary.js";

const createDining = asyncHandler(async (req, res) => {
  try {
    const { title, description, openHour, location, capacity, phoneNumber } =
      req.body;

    const avatar = {
      url: req.file?.path,
      public_id: req.file?.filename,
    };

    const existing = await diningModel.findOne({ title });
    if (existing) {
      return res.json({
        success: false,
        message: "Dining already exists",
      });
    }

    const dining = await diningModel.create({
      title,
      description,
      openHour,
      location,
      capacity,
      phoneNumber,
      images: avatar,
    });

    if (dining) {
      return res.json({
        success: true,
        message: "Dining created successfully",
        dining,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid Data",
      });
    }
  } catch (error) {
    console.log("Create dining error:", error);
    return res.json({
      success: true,
      message: error?.message,
    });
  }
});

const deleteDining = asyncHandler(async (req, res) => {
  try {
    const diningData = await diningModel.findById(req.params.id);
    if (!diningData) {
      return res.json({
        success: false,
        message: "No Data here.",
      });
    }

    // delete images form cloudinary
    if (diningData?.images.public_id) {
      await cloudinary.uploader.destroy(diningData?.images.public_id);
    }
    await diningModel.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "Dining removed successfully.",
    });
  } catch (error) {
    console.log("Delete dining error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const singleDining = asyncHandler(async (req, res) => {});
const getallDining = asyncHandler(async (req, res) => {
  try {
    res.send("Hello dining");
  } catch (error) {
    console.log("get all error:", error);
  }
});
const updateDining = asyncHandler(async (req, res) => {});

export { createDining, deleteDining, singleDining, getallDining, updateDining };
