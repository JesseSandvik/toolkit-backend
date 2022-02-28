const User = require('../model/User');

const readUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'ID parameter is required.' });
  }

  const user = await User.findOne({ _id: req.params.id }).exec();

  if (user) {
    return res.status(204).json({ message: `No user matches the ID: ${req.params.id}`});
  }
  res.json(User);
}

const listUsers = async (req, res) => {
  const users = await User.find();

  if (!users) return res.status(204).json({ message: 'No users found.' });
  res.json(users);
}

module.exports = {
  readUser,
  listUsers,
}