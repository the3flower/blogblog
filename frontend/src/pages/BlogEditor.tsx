import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import Tiptap from "../components/Tiptap";
import { Blog } from "../type";

interface BlogEditorProps {
  blogContent?: Object;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ blogContent }) => {
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [blogDetails, setBlogDetails] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const param = useParams();
  useEffect(() => {
    console.log(param);

    if (!param || Object.keys(param).length === 0) {
      setIsEditing(false);
    }
  }, [param]);

  const fetchBlogDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/blog/${param.blogId}`
      );
      if (!response.ok) throw new Error("Cannot fetch blog details");
      const data = await response.json();

      if (data && data.length > 0) {
        setBlogDetails(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, []);

  return (
    <div>
      <Navbar
        isCreatingNewBlog={!isEditing}
        isAtEditBlogPage={true}
        blogTitle={blogDetails?.blogTitle}
      />
      <div className="card">
        {isLoadingData ? (
          <p>Loading...</p>
        ) : (
          <Tiptap content={blogDetails ? blogDetails : ""} />
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
