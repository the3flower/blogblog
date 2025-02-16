import { Editor } from "@tiptap/react";
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
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
interface MenubarProps {
  editor: Editor;
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
    <div className="px-20 py-5 mb-5 sticky top-[65.5px] bg-base-100 z-40 bb">
      <div className="flex justify-center">
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
          className={`btn btn-square min-w-12${
            editor.isActive("strike") ? "is-active" : ""
          }`}
        >
          <FormatStrikethroughIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={`btn btn-square min-w-12${
            editor.isActive("code") ? "is-active" : ""
          }`}
        >
          <CodeOffIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`btn  min-w-12 mt-0 ${
            editor.isActive("paragraph") ? "is-active" : ""
          }`}
        >
          Paragraph
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`btn btn-square min-w-12${
            editor.isActive("heading") ? "is-active" : ""
          }`}
        >
          Title
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`btn btn-square min-w-12${
            editor.isActive("bulletlist") ? "is-active" : ""
          }`}
        >
          <FormatListBulletedIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`btn btn-square min-w-12${
            editor.isActive("orderedlist") ? "is-active" : ""
          }`}
        >
          <FormatListNumberedIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`btn btn-square min-w-12${
            editor.isActive("codeBlock") ? "is-active" : ""
          }`}
        >
          <Code />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`btn btn-square min-w-12${
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

export default MenuBar;
