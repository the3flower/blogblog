import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { EditorContent, useEditor } from "@tiptap/react";
import TextStyle, { TextStyleOptions } from "@tiptap/extension-text-style";
import { ListItem } from "@mui/material";
import Color from "@tiptap/extension-color";
import StarterKit from "@tiptap/starter-kit";
import ListKeymap from "@tiptap/extension-list-keymap";
import Image from "@tiptap/extension-image";
import { mockBlog } from "../mock";
import { Blog } from "../type";

const BlogDetails: React.FC = () => {
  const [blogDetails, setBlogDetails] = useState<Blog | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { blogId } = useParams();

  const editor = useEditor({
    editable: false,
    content: mockBlog,
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({
        types: [ListItem.name],
      } as Partial<TextStyleOptions>),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Image,
      ListKeymap,
    ],
  });

  const fetchBlogDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/blog/${blogId}`);
      if (!response.ok) throw new Error("Cannot fetch blog details");
      const data = await response.json();

      if (data && data.length > 0) {
        const fetchedBlogDetails = data[0];
        setBlogDetails(fetchedBlogDetails);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [blogId]);

  useEffect(() => {
    // Set new content only if the blogContent and editor instance exists
    if (editor && blogDetails?.blogContent) {
      const newContent = {
        type: "doc",
        content: blogDetails.blogContent,
      };
      editor.commands.setContent(newContent);
      console.log("set new content!");
    }
  }, [editor, blogDetails]);

  if (isLoadingData) {
    return <>Loading...</>;
  }

  return (
    <div className="card">
      <Navbar
        isAtEditBlogPage={false}
        isCreatingNewBlog={false}
        blogTitle={blogDetails?.blogTitle}
      />
      {blogDetails && (
        <div>
          <div className="font-bold text-[5rem] text-center mt-2 py-[2rem] pt-4">
            {blogDetails.blogTitle}
          </div>
          <div className="text-center text-dark-gray font-semibold]">
            {blogDetails.blogDescription}
          </div>
        </div>
      )}
      <div className="divider px-5"></div>
      <article className="prose self-center prose-xl prose-gray mt-12 mb-[50rem]">
        <EditorContent editor={editor} />
      </article>
    </div>
  );
};

export default BlogDetails;
