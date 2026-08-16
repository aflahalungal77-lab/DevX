const User = require('../models/User');
const getProfile = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};
const updateProfile = async (req, res) => {
    const {
  name,
  bio
} = req.body;
const projects = await Project
    .find()
    .populate("user", "name email bio skills profilePicture");
const updateData = {
  name,
  bio
};
  const userId = req.user.id;
  const updatedUser = await User.findByIdAndUpdate(
  userId,
  updateData,
  { new: true }
).select('-password');
  if (!updatedUser) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(updatedUser);
};

module.exports = { getProfile,updateProfile };