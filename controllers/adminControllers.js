import asyncHandler from "express-async-handler";

const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  res.send("login got hit");
});
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  res.send("Register got hit");
});

const getAllUser = asyncHandler(async (req, res) => {
  res.send("Hello Auth profile");
});

export { loginUser, registerUser, getAllUser };
