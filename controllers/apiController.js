const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Refresh = require("../models/Refresh");
const Post = require("../models/Post");

module.exports = {
  index: async (req, res) => {
    try {
      if (req.user.isAdmin === true) {
        const posts = await Post.find().populate({
          path: "userId",
          select: "username isAdmin",
        });
        res.status(200).json({ posts });
      } else {
        const posts = await Post.find({ userId: req.user.id }).populate({
          path: "userId",
          select: "username isAdmin",
        });
        res.status(200).json({ posts });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const idPost = req.params.id;
      const userId = req.user.id;
      const { title, content } = req.body;

      if (title == undefined || content == undefined || idPost == undefined)
        return res.status(400).json({ error: "missing data" });
      const post = await Post.findOne({ _id: idPost, userId });
      if (post === null)
        return res.status(422).json({ message: " cannot process for update" });
      post.title = title;
      post.content = content;
      await post.save();
      res.status(200).json({ idPost: idPost, message: "success update post" });
    } catch (error) {
      // console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  add: async (req, res) => {
    try {
      const title = req.body.title;
      const content = req.body.content;
      const data = { title, content, userId: req.user.id };
      await Post.create(data);
      res.status(201).json({ message: "Created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  auth: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username === undefined || password === undefined)
        return res
          .status(401)
          .json({ message: "username and password is required" });
      const user = await User.findOne({ username: username });
      if (user === null)
        return res
          .status(403)
          .json({ message: "username or password incorrect" });
      const isPassword = await bcrypt.compare(password, user.password);
      if (isPassword === true) {
        const data = { name: username, isAdmin: user.isAdmin, id: user._id };
        const accessToken = generateAccessToken(data);
        const refreshToken = jwt.sign(data, process.env.REFRESH_SECRET_KEY);
        await Refresh.create({ token: refreshToken, userId: user._id });
        res.status(200).json({
          message: "login success",
          tokenType: "Bearer",
          accessToken,
          refreshToken,
        });
      } else {
        res.status(403).json({ message: "username or password incorrect" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  token: async (req, res) => {
    try {
      const refreshToken = req.body.token;
      if (refreshToken == null) return res.sendStatus(401);
      const refreshTokens = await Refresh.findOne({ token: refreshToken });
      if (refreshToken == null || refreshTokens == undefined)
        return res.sendStatus(403);
      jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: err.message });
        const accessToken = generateAccessToken({
          name: user.name,
          isAdmin: user.isAdmin,
          id: user.id,
        });
        res.status(200).json({ accessToken, tokenType: "Bearer" });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  },

  logout: async (req, res) => {
    try {
      const refresh = await Refresh.findOne({ token: req.body.token });
      if (refresh == null) return res.sendStatus(205);
      await refresh.remove();
      res.status(200).json({ msg: "Logged out" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "120s" });
}
