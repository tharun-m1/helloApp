const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const errorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
// ========================= Sign Up ========================================
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: encryptedPassword });
    return res.status(200).json({
      status: "OK",
      message: "User Created",
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});
// ==========================================================================

// ===========================Log In=========================================
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User Not Found"));
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return next(errorHandler(401, "Incorrect Password"));
    }
    const payload = {
      userId: user._id,
    };
    const jwToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: 60 * 60,
    });
    return res.status(200).json({
      status: "OK",
      jwToken,
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});
// ========================================================================
module.exports = router;
