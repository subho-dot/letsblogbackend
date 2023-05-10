import cookieParser from "cookie-parser";
import express from "express";
// import mongoose from "mongoose";
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const app= express();

app.use(express.json());

const upload = multer({ storage });

app.post("/server/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use(cookieParser());
app.use("/server/auth", authRoutes);
app.use("/server/posts", postRoutes);

app.listen(8800, () => {
  console.log("server started");
})

//blog123
//mongodb+srv://Subho:<password>@blogscluster.8wz0lwh.mongodb.net/?retryWrites=true&w=majority