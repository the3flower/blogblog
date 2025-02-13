const asyncHandler = require("express-async-handler");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

/*
List all Blog (Admin side)
: 
*/

/* 
Create Blog - POST
: Save the blog post as a draft
: POST - Save Blog Content to database
*/
exports.blogCreate = asyncHandler(async (req, res, next) => {
  const blogAuthor = await userModel.findOne({ email: req.email });
  const {
    blogTitle,
    blogDescription,
    // blogTag, omit the tag for now
    blogContent,
    blogPublished,
  } = req.body;

  try {
    const newBlog = new blogModel({
      blogTitle,
      blogDescription,
      // blogTag,
      blogAuthor: blogAuthor._id,
      blogCreatedAt: Date.now(),
      blogContent,
      blogPublished,
    });
    newBlog.blogAuthor = blogAuthor;
    // Check Blog Title Similarity
    const similarTitle = await blogModel.findOne({ blogTitle });
    if (similarTitle) {
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "Blog Title has already used!",
      });
    }
    // Save Blog Content
    const saveBlog = await newBlog.save();

    console.log(saveBlog);
    // Response Success
    res.status(200).json({
      status: "success",
      data: [],
      message: "Your Blog has been saved and created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      status: 500,
      data: [],
      message: "Server Error (Create Blog)!",
    });
  }
});

/*
Update Blog - PUT
: Save when Blog Edited
: PUT - Update created Blog
*/
exports.blogUpdate = asyncHandler(async (req, res, next) => {});

/* 
Publish Blog - GET
*/

/* 
Save and Publish Blog
*/

exports.getAllBlogs = asyncHandler(async (req, res) => {
  try {
    //populate is used to perform automatic joins between collections.

    const allBlogs = await blogModel.find().populate("blogAuthor");

    if (allBlogs.length === 0) {
      return res.status(404).send({ message: "No blogs found" });
    }
    res.status(200).json(allBlogs);
  } catch (error) {
    // Handle any unexpected errors
    console.error(error);
    res.status(500).send({ message: "Server error while fetching blogs" });
  }
});

exports.getUserBlogs = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const blogAuthor = await userModel.findById(userId);
    if (!blogAuthor) {
      return res.status(404).json({ message: "User not found" });
    }

    const userBlogs = await blogModel.find({ blogAuthor: blogAuthor._id }).populate("blogAuthor").select('-blogContent');

    if (userBlogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for this user" });
    }

    res.status(200).json(userBlogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching user's blogs" });
  }
});


exports.getBlogDetails = asyncHandler(async (req, res) => {
  try {
    const blogs = await blogModel.find({ _id: req.params.blogId });
    if (!blogs) return res.status(404).send({ message: "No blog found" });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).send({ message: "request error" + err });
  }
});

exports.deleteBlogById = asyncHandler(async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    await blogModel.findByIdAndDelete(req.params.blogId);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting the blog" });
  }
});
