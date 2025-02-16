import React, { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { UserDetails } from "../type";
interface NavbarProps {
  isCreatingNewBlog: boolean;
  isAtEditBlogPage: boolean;
  blogTitle?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  isCreatingNewBlog,
  isAtEditBlogPage,
  blogTitle,
}) => {
  const { isAuthenticated } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const navigate = useNavigate();
  const { logout } = useAuthContext();
  const handleLogout = () => {
    logout();
    setIsOpen(false); // Close the dropdown
  };

  const getUserDetails = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/users/getUserDetails",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error("Cannot get user details: " + errorData.message);
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (err) {
      console.error("Failed to fetch user details:", err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getUserDetails();
    }
  }, [isAuthenticated]);

  return (
    <div className="navbar bg-base-100 flex justify-between sticky top-0 z-50 p-5 shadow-sm large:justify-evenly">
      <div>
        <a
          className="btn btn-ghost text-4xl font-bold mr-3 "
          onClick={() => navigate("/")}
        >
          BlogBlog
        </a>
        {blogTitle ? (
          <div className="text-gray mt-3">
            {isAtEditBlogPage && isCreatingNewBlog ? (
              <span>Editing: </span>
            ) : (
              ""
            )}
            {blogTitle}
          </div>
        ) : (
          ""
        )}
        {isAtEditBlogPage && !blogTitle && isCreatingNewBlog ? (
          <div className="text-gray mt-3">Creating new blog</div>
        ) : (
          ""
        )}
        {!blogTitle && !isAtEditBlogPage ? (
          <label className="input input-bordered flex items-center gap-2 h-9 mt-3 xs:hidden md:flex mr-3">
            <input type="text" className="grow" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        ) : (
          ""
        )}
      </div>
      <div>
        {isCreatingNewBlog && isAtEditBlogPage ? (
          <button type="button" className="btn btn-success btn-sm mr-5">
            Publish
          </button>
        ) : (
          ""
        )}
        {!isAtEditBlogPage && isAuthenticated ? (
          <>
            <Link to="/edit">
              <div className=" mr-3 btn btn-circle  bg-transparent border-none shadow-none self-end mt-3">
                <PostAddIcon className="color-black" />
              </div>
            </Link>
            <div className="font-bold mr-5 mt-3">
              {userDetails.firstName} {userDetails.lastName}
            </div>
          </>
        ) : (
          ""
        )}
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
              onClick={() => setIsOpen(true)}
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Profile"
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                />
              </div>
            </div>
            {isOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <div>
                  <Link to={`/profile/${userDetails._id}`}>
                    <li>
                      <a className="justify-between">Profile</a>
                    </li>
                  </Link>
                  <Link to={`/admin/${userDetails._id}`}>
                    <li>
                      <a>Dashboard</a>
                    </li>
                  </Link>

                  <li>
                    <a onClick={handleLogout}>Logout</a>
                  </li>
                </div>
              </ul>
            )}
          </div>
        ) : (
          <Link to="/login">
            <div className="ml-10 font-bold">Login</div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
