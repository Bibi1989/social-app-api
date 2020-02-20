const express = require("express");
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  createComment,
} = require("../controllers/posts/blogPost");
const { auth } = require("../controllers/auth/auth");
const router = express.Router();

/* GET home page. */
router.get("/posts", getPosts);

router.get("/posts/:postId", auth, getPost);

router.post("/posts", auth, createPost);

router.patch("/posts/:updateId", auth, updatePost);

router.post("/likes/:likeId", auth, likePost);

router.post("/comments/:commentId", auth, createComment);

router.delete("/posts/:deleteId", auth, deletePost);

module.exports = router;
