import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle, { TextStyleOptions } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import ListKeymap from "@tiptap/extension-list-keymap";
import StarterKit from "@tiptap/starter-kit";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import { Code } from "@mui/icons-material";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import CodeOffIcon from "@mui/icons-material/CodeOff";
import ImageIcon from "@mui/icons-material/Image";
import React, { useEffect, useState } from "react";
import { Blog } from "../type";

interface MenubarProps {
  editor: Editor;
}

interface TipTapProps {
  onEditorSubmit?: (content: string) => void;
  content?: Blog;
}

const MenuBar: React.FC<MenubarProps> = ({ editor }) => {
  const handleImageUpload = async (e: any) => {
    const image = e.target.files[0];
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string" && editor) {
          editor.chain().focus().setImage({ src: reader.result }).run();
        }
      };
      reader.readAsDataURL(image);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group px-20 py-5 mb-20 sticky top-[105.5px] bg-base-100 z-40">
      <div className="button-group flex justify-center">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`btn btn-square ${
            editor.isActive("bold") ? "is-active" : ""
          }`}
        >
          <FormatBoldIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`btn btn-square min-w-12 ${
            editor.isActive("italic") ? "is-active" : ""
          }`}
        >
          <FormatItalicIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`btn btn-square min-w-12 ${
            editor.isActive("strike") ? "is-active" : ""
          }`}
        >
          <FormatStrikethroughIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`btn btn-square min-w-12 ${
            editor.isActive("code") ? "is-active" : ""
          }`}
        >
          <CodeOffIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`btn min-w-12 mt-0 ${
            editor.isActive("paragraph") ? "is-active" : ""
          }`}
        >
          Paragraph
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`btn btn-square min-w-12 ${
            editor.isActive("heading") ? "is-active" : ""
          }`}
        >
          Title
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`btn btn-square min-w-12 ${
            editor.isActive("bulletList") ? "is-active" : ""
          }`}
        >
          <FormatListBulletedIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`btn btn-square min-w-12 ${
            editor.isActive("orderedList") ? "is-active" : ""
          }`}
        >
          <FormatListNumberedIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`btn btn-square min-w-12 ${
            editor.isActive("codeBlock") ? "is-active" : ""
          }`}
        >
          <Code />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`btn btn-square min-w-12 ${
            editor.isActive("blockquote") ? "is-active" : ""
          }`}
        >
          <FormatQuoteIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`btn btn-square min-w-12`}
        >
          <HorizontalRuleIcon />
        </button>

        <div>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <label htmlFor="fileInput" className="btn btn-square min-w-12 ml-1">
            <ImageIcon />
          </label>
        </div>
      </div>
    </div>
  );
};

const TipTap: React.FC<TipTapProps> = ({ content }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const editor = useEditor({
    editable: true,
    content: `<p>Start writing...</p>`,
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

  useEffect(() => {
    if (editor && content?.blogContent) {
      const newContent = {
        type: "doc",
        content: content.blogContent,
      };
      editor.commands.setContent(newContent);
      console.log("set new content!");
    }
  }, [editor, content]);

  useEffect(() => {
    if (content) {
      setTitle(content.blogTitle);
      setDescription(content.blogDescription);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  const handleClick = async () => {
    const blogContentData = editor.getJSON();
    console.log("Data from Tiptap before fetch:", blogContentData);

    if (title && description) {
      alert(`${title} ${description}`);
      console.log(`${title} ${description}`);
    }

    // POST, /blog/blogSave
    try {
      const response = await fetch("http://localhost:3000/blog/blogSave", {
        method: "POST",
        body: JSON.stringify({ blogContent: blogContentData.content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // If Response Error
      if (!response.ok) {
        throw new Error(`Server Response status! ${response.status}`);
      }
      console.log("Server Response", response);
    } catch (error) {
      console.log("Fetch (Create Blog) Error!!! ", error);
    }
  };

  return (
    <article className="prose self-center prose-xl prose-gray">
      <div className="flex mt-10 pb-0">
        <h1 className="mr-3 font-bold mb-0">Title</h1>
        <input
          type="text"
          placeholder="Enter your blog title"
          className="input w-full mt-3 focus:outline-none border-none text-3xl font-semibold"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update title on change
        />
      </div>
      <div className="flex mt-2">
        <p className="ml-1 mr-4 font-bold my-2 self-start text-black">
          Description
        </p>
        <textarea
          placeholder="Add some description..."
          className="textarea w-full mt-[0.4rem] focus:outline-none border-none text-md font-semibold resize-none no-scrollbar h-12"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update description on change
        />
      </div>
      {editor ? <MenuBar editor={editor} /> : ""}
      <EditorContent editor={editor} />
      <button className="btn btn-success mb-10 w-full" onClick={handleClick}>
        Submit
      </button>
    </article>
  );
};

export default TipTap;
