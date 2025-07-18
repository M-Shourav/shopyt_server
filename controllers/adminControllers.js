import asyncHandler from "express-async-handler";
import validator from "validator";
import userModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import cloudinary from "../config/cloudinary.js";

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = generateToken(user?._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "user loggedIn successfully",
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        avatar: user?.avatar,
      },
    });
  } catch (error) {
    console.log("user login error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //   check credentials
    if (!name) {
      return res.json({
        success: false,
        message: "Name is required!",
      });
    }
    if (!email) {
      return res.json({
        success: false,
        message: "email is required!",
      });
    }
    if (!password) {
      return res.json({
        success: false,
        message: "Password is required!",
      });
    }

    // check email validation
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Invalid Email address.",
      });
    }

    // check user
    const ExistingUser = await userModel.findOne({ email });
    if (ExistingUser) {
      return res.json({
        success: false,
        message: "User Already exists, try different email.",
      });
    }

    // check password length
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be grater than or equal 8",
      });
    }

    const avatar = {
      url: req.file?.path,
      public_id: req.file?.filename,
    };

    // create new user
    const user = await userModel.create({
      name,
      email,
      password,
      avatar,
      role,
    });

    if (user) {
      return res.json({
        success: true,
        message: "user register successfully.",
        user: {
          _id: user?._id,
          name: user?.name,
          email: user?.email,
          password: user?.password,
          avatar: user?.avatar,
          role: user?.role,
        },
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.error("user register error:", error?.message);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

const userLogout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.json({
      success: true,
      message: "User logout successfully",
    });
  } catch (error) {
    console.log("User logout error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }
    if (
      req.user._id.toString() !== user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.json({
        success: false,
        message: "Not authorized to update this user",
      });
    }

    if (req.file) {
      if (user.avatar && user.avatar.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }
      // save new user
      user.avatar = {
        url: req.file?.path,
        public_id: req.file?.filename,
      };
    }

    if (name) user.name = name;
    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Invalid Email address.",
        });
      }
      user.email = email;
    }
    if (role) user.role = role;

    // update user data
    const update = await user.save();

    return res.json({
      success: true,
      message: "User update successfully",
      user: {
        _id: update?._id,
        name: update?.name,
        email: update?.email,
        avatar: update?.avatar,
        role: update?.role,
      },
    });
  } catch (error) {
    console.log("User update error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }
    // delete image from cloudinary
    if (user?.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar?.public_id);
    }
    // delete user from database
    await userModel.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    console.log("user delete error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const total = await userModel.countDocuments({});
    const user = await userModel.find().select("-password");
    return res.json({
      success: true,
      total,
      user,
    });
  } catch (error) {
    console.log("Get all user error:", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

const getMe = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.json({
        success: false,
        message: "User not logged in",
      });
    }

    return res.json({
      success: true,
      user: {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
        role: user?.role,
      },
    });
  } catch (error) {
    console.log("Get me user error", error);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

export {
  loginUser,
  registerUser,
  userLogout,
  updateUser,
  deleteUser,
  getAllUser,
  getMe,
};
