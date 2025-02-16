const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateAccessToken = async (user, time) => {
  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: time }
  );
  return accessToken;
};

const generateRefreshToken = async (user, time) => {
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: time }
  );
  return refreshToken;
};

exports.getUserDetails = asyncHandler(async (req, res) => {
  const user = await userModel.findOne({ email: req.email });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  const { firstName, lastName, _id } = user;
  res.status(200).send({ firstName, lastName, _id });
});


exports.verifyAccessToken = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (accessToken == null) {
    return res.status(401).send({ message: "Access token is missing" });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Invalid or expired token" });
    }
    res.status(200).send({ message: "Access Token is valid" });
  });
});

exports.refreshAccessToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });

  const user = await userModel.findOne({ refreshToken });

  if (!user) {
    return res
      .status(403)
      .json({ message: "Invalid Refresh Token", refreshToken });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token" });
      const accessToken = await generateAccessToken(user, "3m");

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });

      res.status(200).json({ message: "Access token refreshed" });
    }
  );
});

exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (password.length < 6) {
    return res.status(403).send({ message: "Password less than 6 characters" });
  }
  try {
    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password,
      registerDate: Date.now(),
    });

    const userExist = await userModel.find({ email: newUser.email });
    if (userExist.length > 0) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email already in used" });
    }

    const saveUser = await newUser.save();
    res
      .status(200)
      .json({ message: "user created successfully with", saveUser });
  } catch (error) {
    res
      .status(401)
      .json({ message: "User not successful created", error: error.message });
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await userModel.findOne({ email: email }).select("+password");

  if (!user) {
    return res
      .status(401)
      .json({ message: "Login failed", error: "Invalid email or password" });
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = await generateAccessToken(user, "3m");
      const refreshToken = await generateRefreshToken(user, "1d");

      user.refreshToken = refreshToken;

      await user.save();

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Login failed", error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Refresh token is required" });
  }
  const user = await userModel.findOneAndUpdate(
    { refreshToken: token },
    { refreshToken: null }
  );

  if (!user) {
    return res.status(403).json({ message: "Invalid Token" });
  }
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Logout successful" });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await userModel.findOneAndDelete({ email: req.email });
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }
  res.status(200).send({ message: "user deleted " + user });
});

exports.getAllUsersDetails = asyncHandler(async (req, res) => {
  const user = await userModel.find()
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }
  res.status(200).send({ message: "user deleted " + user });
});


exports.getUserDetailsById = asyncHandler(async (req, res) => {
  const userId = req.params.userId
  const user = await userModel.findById(userId).select('-refreshToken')
  if (!user) {
    return res.status(403).json({ message: "User not found" });
  }
  res.status(200).send(user);
});
