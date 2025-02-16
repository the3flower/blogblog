import React from "react";
import { BlogsList } from "../type";
import BlogCard from "./BlogCard";

const BlogList: React.FC<BlogsList> = ({ blogs }) => {
  return (
    <div className="px-20">
      {blogs.map((blog, index) => (
        <BlogCard key={index} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
