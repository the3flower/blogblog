import React from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  userId: string | undefined; // Include userId here
}

const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  userId,
}) => {
  const navigate = useNavigate();
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 pt-5">Admin Dashboard</h2>
      <ul>
        <li
          className={`flex items-center mb-4 transition btn ${
            activePage === "Overview" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
          onClick={() => setActivePage("Overview")}
        >
          <span className="ml-2">Tag Edit</span>
        </li>
        <li
          className={`flex items-center mb-4 transition btn ${
            activePage === "Tag Edit" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
          onClick={() => {
            setActivePage("Manage Blogs");
            navigate(`/admin/${userId}`);
          }}
        >
          <span className="ml-2">Manage Blogs</span>
        </li>
        <li
          className={`flex items-center mb-4 transition btn ${
            activePage === "Settings" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
          onClick={() => {
            navigate(`/`);
          }}
        >
          <span className="ml-2">Home</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
