import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Blog } from "../type"; // Adjust the import path as necessary
import Navbar from "../components/Navbar";

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>(); // Get userId from URL parameters
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    registerDate: Date;
  } | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const userResponse = await fetch(
          `http://localhost:3000/users/${userId}`
        );
        if (!userResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user's blogs
        const blogResponse = await fetch(
          `http://localhost:3000/blog/user/${userId}`
        );
        if (!blogResponse.ok) {
          throw new Error("Network response was not ok");
        }
        const blogData: Blog[] = await blogResponse.json();
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Navbar isCreatingNewBlog={false} isAtEditBlogPage={false} />

      <div className="min-h-screen bg-gray-100 py-10">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://via.placeholder.com/150"
              alt="User avatar"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-700">{`${user.firstName} ${user.lastName}`}</h1>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-400 text-sm">
                Joined on {new Date(user.registerDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Blogs by {user.firstName}
            </h2>
            {blogs.length > 0 ? (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="p-4 bg-gray-50 rounded-lg shadow"
                  >
                    <Link
                      to={`/blogs/${blog.blogAuthor.firstName}-${blog.blogAuthor.lastName}/${blog._id}`}
                    >
                      <h3 className="text-lg font-semibold text-gray-800">
                        {blog.blogTitle}
                      </h3>
                    </Link>
                    <p className="text-gray-600">{blog.blogDescription}</p>
                    <p className="text-gray-400 text-sm">
                      Created on{" "}
                      {new Date(blog.blogCreatedAt).toLocaleDateString()}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          blog.blogPublished
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {blog.blogPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No blogs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
