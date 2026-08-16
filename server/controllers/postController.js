const Post = require('../models/Post');
const createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const newPost = new Post({
    user: userId,
    content
  });

await newPost.save();

const populatedPost = await newPost.populate(
    "user",
    "name email bio skills profilePicture"
);

res.status(201).json(populatedPost);
};

const getPosts = async (req, res) => {
  const posts = await Post.find().populate('user', 'name profilePicture')
  .populate('comments.user', 'name profilePicture').sort({ createdAt: -1 });
  res.json(posts);
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
   if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }
  // Check if the logged-in user is the owner of the post
  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to update this post' });
  }

  post.content = content;
  await post.save();
  res.json(post);
};


const deletePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Check if the logged-in user is the owner of the post
  if (post.user.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Not authorized to delete this post' });
  }

  await Post.findByIdAndDelete(postId);
  res.json({ message: 'Post deleted successfully' });
};

//like a post
const likePost = async (req, res) => {
  const { postId } = req.params;

const post = await Post.findById(postId);

if (!post) {
  return res.status(404).json({
    message: 'Post not found'
  });
}

if (!post.likes) {
  post.likes = [];
}

console.log(post.likes);

const index = post.likes.findIndex(
  (id) => id.toString() === req.user.id
);

  if (index !== -1) {
    return res.status(400).json({
      message: 'Post already liked'
    });
  }

post.likes.push(req.user.id);

await post.save();

console.log("AFTER LIKE:", post.likes);

res.json(post);
};   
const unlikePost = async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }     
    
    const index = post.likes.findIndex((id) => 
  id.toString() === req.user.id
);
if (index === -1) {
  return res.status(400).json({
    message: 'Post not liked yet'
  });
}
    post.likes.splice(index, 1);
    await post.save();
    res.json(post);
}

const commentOnPost = async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({
      message: "Comment is required"
    });
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found"
    });
  }

  post.comments.push({
    user: req.user.id,
    comment: comment
  });

  await post.save();

  res.json(post);
};


module.exports = { createPost, getPosts, updatePost, deletePost, likePost, unlikePost, commentOnPost };              