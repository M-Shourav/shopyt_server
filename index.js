import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/authRoutes.js";
const app = express();
// .env setup
dotenv.config();
const port = process.env.PORT || 8000;

const whiteList = [process.env.ADMIN_URL, process.env.CLIENT_URL];

app.use(
  cors({
    origin: whiteList,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", router);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`server running on port:${port}`);
});
