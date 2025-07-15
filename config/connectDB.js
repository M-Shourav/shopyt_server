import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB is connect");
    });
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("mongoDB connection error:", error);
  }
};

export default connectDB;
