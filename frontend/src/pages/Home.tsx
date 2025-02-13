import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BlogList from "../components/BlogList";
import { Blog } from "../type";

const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  useEffect(() => {
    getAllBlogs();
  }, []);

  const getAllBlogs = async () => {
    try {
      const response = await fetch("http://localhost:3000/blog/blogs");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Fetching blog data failed: ${response.status} - ${
            response.statusText
          } - ${JSON.stringify(errorData)}`
        );
      }

      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  return (
    <div>
      <Navbar isCreatingNewBlog={false} isAtEditBlogPage={false} />
      <div className="large:px-[12%] xl:px-[20%] xxl:px-[30%] flex flex-wrap">
        <BlogList blogs={blogs} />
      </div>
    </div>
  );
};

export default Home;
