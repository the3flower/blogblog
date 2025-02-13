const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authenticateAccessToken } = require("../middlewares/authenticateToken");

// List all User
// router.get("/list", userController.getAllUsersDetails);



// Register
router.post("/register", userController.register);

// Login
router.post("/login", userController.login);

// Logout
router.post("/logout", userController.logout);


// get current user details
router.get(
  "/getUserDetails",
  authenticateAccessToken,
  userController.getUserDetails
);

// Refresh token
router.post("/refresh-access-token", userController.refreshAccessToken);

//Verify access token
router.post("/verify-access-token", userController.verifyAccessToken);

router.delete(
  "/deleteUser",
  authenticateAccessToken,
  userController.deleteUser
);


// Get User Details by Id
router.get("/:userId", userController.getUserDetailsById);

module.exports = router;
