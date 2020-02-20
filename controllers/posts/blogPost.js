const Posts = require("../../models/postModel");

module.exports.getPosts = async (req, res) => {
  try {
    const posts = await Posts.find().sort({ createdAt: -1 });
    return res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports.getPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Posts.findById(postId);
    return res.json({ data: post });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports.createPost = async (req, res) => {
  const { username, email, id } = await req.user;
  const { body } = req.body;
  const error = validatePost(body);
  if (error.body) return res.status(404).json({ error: error });
  try {
    const post = new Posts({
      id,
      body,
      username,
      email
    });
    await post.save();
    return res.json({ data: post });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { deleteId } = req.params;
    const deleted = await Posts.findByIdAndDelete(deleteId);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    return res.json({ data: "Deleted Successfully" });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports.likePost = async (req, res) => {
  const user = await req.user;
  console.log("user", user);
  try {
    const { likeId } = req.params;
    const posts = await Posts.findById(likeId);
    if (posts) {
      if (posts.likes.find(like => like.username === user.username)) {
        posts.likes = posts.likes.filter(
          like => like.username !== user.username
        );
      } else {
        posts.likes.push({
          username: user.username,
          createdAt: new Date().toISOString()
        });
      }
      await posts.save();
      res.json({ data: posts });
    } else {
      throw new UserInputError("Post is not found");
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

function validatePost(body) {
  const error = {};
  if (body.trim() === "") {
    error.body = "Password is empty";
  }
  return error;
}
