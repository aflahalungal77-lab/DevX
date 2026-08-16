const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {createPost, getPosts,updatePost,deletePost,likePost,unlikePost,commentOnPost} = require('../controllers/postController');

router.post('/', protect, createPost);
router.get('/', getPosts);
router.put('/:postId', protect, updatePost);
router.delete('/:postId', protect, deletePost);
router.post('/:postId/like', protect, likePost);
router.delete('/:postId/unlike', protect, unlikePost);
router.post('/:postId/comments', protect, commentOnPost);

module.exports = router;