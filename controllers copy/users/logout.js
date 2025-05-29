const User = require("../../models/user");

const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { token: null });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = logout;
