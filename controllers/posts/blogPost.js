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
  if (error.body) return res.status(404).json({ error: error.body });
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

module.exports.updatePost = async (req, res) => {
  const { username, email, id } = await req.user;
  try {
    const { updateId } = req.params;
    const { body } = req.body;
    const error = validatePost(body);
    if (error.body)
      return res.status(404).json({ error: "Input field is empty" });
    const updateObj = {
      id,
      body,
      username,
      email,
      createdAt: new Date().toISOString()
    };
    const post = await Posts.findByIdAndUpdate(updateId, updateObj, {
      new: true
    });
    res.json({ data: post });
  } catch (error) {}
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
      res.json({ data: posts, likeCount: posts.likes.length });
    } else {
      throw new UserInputError("Post is not found");
    }
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports.createComment = async (req, res) => {
  const user = await req.user;
  try {
    const { body } = req.body;
    const { commentId } = req.params;
    const error = validatePost(body);
    if (error.body) {
      res.status(404).json({ error: "Comment field is empty" });
    }

    const post = await Posts.findById(commentId);

    if (post) {
      post.comments.unshift({
        body,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      await post.save();
      console.log(post.comments[0]._id);
      res.json({ data: post, commentsCount: post.comments.length });
    } else {
      res.status(404).json({ error: "Post do not exist" });
    }
  } catch (error) {
    console.log("caught here");
    res.status(404).json({ error: error.message });
  }
};

module.exports.deleteComment = async (req, res) => {
  const user = req.user;

  const { postId } = req.params;

  try {
    const post = await Posts.findById(postId);
    if (post) {
      const finded = post.comments.find(comment => comment.id === req.body.id);
      if (finded) {
        const filtered = post.comments.filter(
          comment => comment.id !== req.body.id
        );
        post.comments = filtered;
        await post.save();
      }
    }
    res.json({ data: post });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports.updateComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;
    const error = validatePost(body);
    if (error.body)
      return res.status(404).json({ error: "comment body is empty" });
    const post = await Posts.findById(postId);
    if (post) {
      const finded = post.comments.find(comment => comment.id === req.body.id);
      finded.body = body;
      await post.save();
    }
    res.json({ data: post });
  } catch (error) {}
};

function validatePost(body) {
  const error = {};
  if (body.trim() === "") {
    error.body = "Body is empty";
  }
  return error;
}
