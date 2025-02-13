import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Blog } from "../type";
import Sidebar from "../components/SideBar";
import Navbar from "../components/Navbar";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const { userId } = useParams<{ userId: string }>();
  const [deleteBlog, setDeleteBlog] = useState<Blog | null>(null);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [activePage, setActivePage] = useState<string>("Manage Blogs");

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/blog/user/${userId}`
        );

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

    getAllBlogs();
  }, [userId]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the blog post");
      }

      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      setDeleteBlog(null); // Clear deleteBlog after deletion
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const openDeleteModal = (blog: Blog) => {
    setDeleteBlog(blog);
    document.getElementById("delete_modal")?.showModal(); // Open the modal
  };
  const openEditModal = (blog: Blog) => {
    setEditBlog(blog);
    document.getElementById("edit_modal")?.showModal(); // Open the modal
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <Navbar isAtEditBlogPage={false} isCreatingNewBlog={false} />
      <div className="flex flex-row">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          userId={userId}
        />

        <div className="flex-1 p-6">
          <h1 className="text-[44px] font-bold mb-4 ml-2 text-gray-dark">
            Blog Details
          </h1>
          <table className="min-w-full bg-white table table-zebra border rounded-lg shadow-lg border-none">
            <thead className="bg-light-border text-primary-gray">
              <tr>
                <th className="py-3 px-4 border-b border-gray-light text-left text-gray-600">
                  Title
                </th>
                <th className="py-3 px-4 border-b border-gray-light text-left text-gray-600">
                  Author
                </th>
                <th className="py-3 px-4 border-b border-gray-light border-gray-light text-left text-gray-600">
                  Date
                </th>
                <th className="py-3 px-4 border-b border-gray-light text-left text-gray-600">
                  Edit
                </th>
                <th className="py-3 px-4 border-b border-gray-light text-left text-gray-600">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-dark">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-light-border transition">
                  <td className="py-2 px-4 border-b border-gray-light">
                    <Link
                      to={`/blogs/${blog.blogAuthor.firstName}-${blog.blogAuthor.lastName}/${blog._id}`}
                      className="border-gray-light hover:underline"
                    >
                      {blog.blogTitle}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-light">
                    {blog.blogAuthor.firstName} {blog.blogAuthor.lastName}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-light">
                    {new Date(blog.blogCreatedAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-light">
                    <div className="flex space-x-2">
                      {/* <Link to={`/edit/${blog._id}`}> */}
                      <EditNoteIcon
                        className="text-blue cursor-pointer"
                        onClick={() => {
                          openEditModal(blog);
                        }}
                      />
                      {/* </Link> */}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-light">
                    <div className="flex space-x-2">
                      <DeleteIcon
                        className="text-error cursor-pointer ml-2"
                        onClick={() => openDeleteModal(blog)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error">Delete</h3>
          <p className="py-4 font-semibold">
            Are you sure you want to delete the following blog?
          </p>
          <p className="pb-4">{deleteBlog?.blogTitle}</p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-error"
                onClick={() => {
                  if (deleteBlog) handleDelete(deleteBlog._id);
                }}
              >
                Delete
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-blue">Edit</h3>
          <p className="py-4 font-semibold">
            Edit blog:{" "}
            <span className="font-normal">{editBlog?.blogTitle}</span>
          </p>

          <div className="modal-action">
            <form method="dialog">
              <Link to={`/edit/${editBlog?._id}`}>
                <button className="btn btn-info">Edit</button>
              </Link>

              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AdminDashboard;
