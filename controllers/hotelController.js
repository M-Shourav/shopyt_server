import asyncHandler from "express-async-handler";
import hotelModel from "../models/hotelModel.js";
import cloudinary from "../config/cloudinary.js";

const createHotel = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      country,
      pricePerNight,
      featured,
    } = req.body;
    const uploadImage = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    if (!uploadImage) {
      return res.json({
        success: false,
        message: "Image must added",
      });
    }

    const existingHotel = await hotelModel.findOne({ title });
    if (existingHotel) {
      return res.json({
        success: false,
        message: "A hotel with this title already exists.",
      });
    }

    const hotel = await hotelModel.create({
      title,
      description,
      address,
      city,
      country,
      pricePerNight,
      featured,
      images: uploadImage,
    });

    if (hotel) {
      return res.json({
        success: true,
        message: "hotel Info create successfully",
        hotel,
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid data",
      });
    }
  } catch (error) {
    console.log("Hotel data create error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const deleteHotel = asyncHandler(async (req, res) => {
  try {
    const hotelData = await hotelModel.findById(req.params.id);
    if (!hotelData) {
      return res.json({
        success: false,
        message: "No Data here.",
      });
    }

    // delete all image from cloudinary

    const imagesDeleted = hotelData.images.map((img) =>
      cloudinary.uploader.destroy(img.public_id)
    );
    await Promise.all(imagesDeleted);

    await hotelModel.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "Hotel Data remove successfully",
    });
  } catch (error) {
    console.log("Hotel info delete error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const getHotel = asyncHandler(async (req, res) => {
  try {
    const total = await hotelModel.countDocuments({});
    const hotels = await hotelModel.find({}).sort({ createdAt: -1 }); //new user first
    if (!hotels) {
      return res.json({
        success: false,
        message: "No hotel founds",
      });
    }

    return res.json({
      success: true,
      total,
      hotels,
    });
  } catch (error) {
    console.log("Fetch hotel info error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const singleHotel = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const hotel = await hotelModel.find({ slug });
    if (!hotel) {
      return res.json({
        success: false,
        message: "No Hotel data",
      });
    }

    return res.json({
      success: true,
      hotel,
    });
  } catch (error) {
    console.log("Get single post error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const updateHotel = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      city,
      country,
      pricePerNight,
      featured,
    } = req.body;

    const hotel = await hotelModel.findById(req.params.id);
    if (!hotel) {
      return res.json({
        success: false,
        message: "No hotel data found",
      });
    }
    let updateImages = hotel.images;
    if (req.files && req.files.length > 0) {
      const deleteImage = hotel.images.map((img) =>
        cloudinary.uploader.destroy(img.public_id)
      );
      await Promise.all(deleteImage);

      updateImages = req.files.map((item) => ({
        url: item.path,
        public_id: item.filename,
      }));
    }
    if (title) hotel.title = title;
    if (description) hotel.description = description;
    if (address) hotel.address = address;
    if (city) hotel.city = city;
    if (country) hotel.country = country;
    if (pricePerNight) hotel.pricePerNight = pricePerNight;
    if (featured) hotel.featured = featured;

    const updateData = await hotel.save();

    return res.json({
      success: true,
      message: "Hotel data update successfully",
      hotel: updateData,
    });
  } catch (error) {
    console.log("Hotel data updating error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

export { createHotel, deleteHotel, getHotel, singleHotel, updateHotel };
