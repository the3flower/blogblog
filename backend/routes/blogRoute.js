const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");
const { authenticateAccessToken } = require("../middlewares/authenticateToken");

//Get all blogs
router.get("/blogs", blogController.getAllBlogs);
router.get("/user/:userId", blogController.getUserBlogs);

// Create blog
router.post("/create", authenticateAccessToken, blogController.blogCreate);
// Update blog
router.put("/update/:id", blogController.blogUpdate);

// Delete blog

router.get("/:blogId", blogController.getBlogDetails);


router.delete("/:blogId", authenticateAccessToken,  blogController.deleteBlogById);

module.exports = router;
