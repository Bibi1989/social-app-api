const express = require("express");
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  likePost,
  createComment
} = require("../controllers/posts/blogPost");
const { auth } = require("../controllers/auth/auth");
const router = express.Router();

/* GET home page. */
router.get("/posts", getPosts);

router.get("/posts/:postId", auth, getPost);

router.post("/posts", auth, createPost);

router.post("/likes/:likeId", auth, likePost);

router.post("/comments/:commentId", auth, likePost);

router.delete("/posts/:deleteId", auth, deletePost);

module.exports = router;
