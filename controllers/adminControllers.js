import asyncHandler from "express-async-handler";

const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  res.send("login got hit");
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
  } catch (error) {
    console.error("user register error:", error?.message);
    return res.json({
      success: false,
      message: error?.message,
    });
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  res.send("Hello Auth profile");
});

export { loginUser, registerUser, getAllUser };
