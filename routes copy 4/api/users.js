const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const User = require("../../models/user");

const signup = require("../../controllers/users/signup");
const login = require("../../controllers/users/login");
const logout = require("../../controllers/users/logout");
const authenticate = require("../../middlewares/authenticate");
const getCurrent = require("../../controllers/users/getCurrent");
const updateSubscription = require("../../controllers/users/updateSubscription");
const upload = require("../../middlewares/upload");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", authenticate, logout);
router.get("/current", authenticate, getCurrent);
router.patch("/", authenticate, updateSubscription);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Avatar file is required" });
      }

      const { path: tempPath, originalname } = req.file;
      const ext = path.extname(originalname);
      const filename = `${req.user._id}${ext}`;
      const finalPath = path.join(avatarsDir, filename);
      const avatarURL = `/avatars/${filename}`;
      const image = await Jimp.read(tempPath);
      await image.resize(250, 250).writeAsync(finalPath);

      await fs.unlink(tempPath);
      await User.findByIdAndUpdate(req.user._id, { avatarURL });

      res.status(200).json({ avatarURL });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
