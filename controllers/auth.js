import mongoose from "mongoose";
// require('dotenv').config();
import {} from 'dotenv/config';
const DB = process.env.DB_URL;
const SECRET = process.env.SECRET;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// mongoose.set("strictQuery", false);
mongoose
  .connect(
    DB,{
      useUnifiedTopology:true,
      useNewUrlParser:true
  }
  )
  .then(() => console.log("connected"))
  .catch((e) => console.log(e));

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, min: 6, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 8 },
  img: {type: String},
});

const UserModel = mongoose.model("User", UserSchema);

const PostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    username: String,
    img: String,
    cat: String,
    // username: UserModel.findOne('username'),
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    
  },
  {
    timestamps: true,
  }
);

export const PostModel = mongoose.model("Post", PostSchema);

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  try {
    await UserModel.create({
      username,
      email,
      password: bcrypt.hashSync(password, salt),
    });
    res.status(200).json("User has been created.");
  } catch (e) {
    res.status(400).json(e);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const userDetails = await UserModel.findOne({ username });
  const passOk =
    userDetails && userDetails.password
      ? await bcrypt.compareSync(password, userDetails.password)
      : false;
  if (passOk) {
    jwt.sign({ username, id: userDetails._id }, SECRET , {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDetails._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong details entered");
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};
