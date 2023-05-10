import {PostModel} from "../controllers/auth.js";
import jwt from "jsonwebtoken";
import {} from 'dotenv/config';
const SECRET = process.env.SECRET;

export const getPosts = async (req,res) => {
  
  res.json(
    

    await PostModel.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );

};

export const getPost = async (req,res) => {
  const {id} = req.params;
  const postDoc = await PostModel.findById(id).populate('author', ['username']);
  res.json(postDoc);
  // console.log(author);
}

export const addPost = (req,res) => {
  const {token} = req.cookies;
  if(!token) return res.status(401).json("not authenticated");
  jwt.verify(token, SECRET, {}, async (err,info) => {
    if (err) throw err;
    const {title,content,username,cat,img} = req.body;
    const postDetails = await PostModel.create({
      title,
      content,
      username,
      cat,
      img,
      author:info.id,
    });
    res.json(postDetails);
  });
}

export const deletePost = (req,res) => {
  const {token} = req.cookies;
  if(!token) return res.status(401).json("not authenticated");
  jwt.verify(token, SECRET, {}, async (err,info) => {
    if (err) throw err;
    // const {title,content,cat,img} = req.body;
    console.log(info.id);
    const postDetails = await PostModel.deleteOne({
      author:info.id ,
    }).then();
    // res.json(postDetails);
  });
}

export const updatePost = async(req,res) => {
  const {token} = req.cookies;
  
  jwt.verify(token, SECRET, {}, async (err,info) => {
    if (err) throw err;
    const {title,content,username,cat,img} = req.body;
    const postDoc = await PostModel.findOne({username});
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    await postDoc.updateOne({
      title,
      content,
      username,
      cat,
      img,
    });

    res.json(postDoc);
  });
}