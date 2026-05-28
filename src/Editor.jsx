/* eslint-disable react-hooks/static-components */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link, ImagePlus } from "lucide-react";

const CSS = `
  .ProseMirror {
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    line-height: 1.75;
    min-height: 160px;
    padding: 16px;
    text-align: left;
  }
  .ProseMirror p { margin-bottom: 10px; text-align: inherit; }
  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #a8a29e;
    pointer-events: none;
    height: 0;
  }
  .ProseMirror img {
    max-width: 100%;
    max-height: 400px;
    width: auto;
    border-radius: 10px;
    margin: 10px 0;
    display: block;
    object-fit: cover;
  }
  .ProseMirror ul { padding-left: 20px; margin-bottom: 10px; list-style-type: disc; }
  .ProseMirror ol { padding-left: 20px; margin-bottom: 10px; list-style-type: decimal; }
  .ProseMirror li { margin-bottom: 4px; }
  .ProseMirror strong { font-weight: 700; }
  .ProseMirror em { font-style: italic !important; }
  .ProseMirror u { text-decoration: underline; }
  .ProseMirror .tiptap-image-upload { display: none; }
`;

export default function Editor({ onChange, darkMode, dk, initialContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ italic: true }),
      Underline,
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: "What's on your mind today..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const iconSize = 16;
  const iconStroke = 2.2;

  const Btn = ({ action, label, title, active = false }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); action(); }}
      title={title}
      style={{
        minWidth: "30px", height: "32px",
        padding: "0 6px",
        borderRadius: "6px", border: "none",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", fontWeight: "600",
        fontFamily: "'DM Sans', sans-serif",
        background: active ? (darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)") : "transparent",
        color: dk.text,
        transition: "background 0.15s, color 0.15s",
      }}
    >
      {label}
    </button>
  );

  const Divider = () => (
    <div style={{ width: "1px", height: "20px", background: dk.divider, margin: "0 3px" }} />
  );

  const handleImageURL = () => {
    const url = prompt("Paste an image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
    reader.readAsDataURL(file);
  };

  if (!editor) return null;

  return (
    <>
      <style>{CSS}</style>

      <div style={{
        display: "flex", gap: "4px", padding: "6px 8px",
        background: dk.toolbarBg, borderRadius: "10px",
        marginBottom: "12px", flexWrap: "wrap", alignItems: "center",
      }}>
        {/* Text formatting */}
        <Btn action={() => editor.chain().focus().toggleBold().run()}
          label={<Bold size={iconSize} strokeWidth={iconStroke} />}
          title="Bold"
          active={editor.isActive("bold")} />
        <Btn action={() => editor.chain().focus().toggleItalic().run()}
          label={<Italic size={iconSize} strokeWidth={iconStroke} />}
          title="Italic"
          active={editor.isActive("italic")} />
        <Btn action={() => editor.chain().focus().toggleUnderline().run()}
          label={<UnderlineIcon size={iconSize} strokeWidth={iconStroke} />}
          title="Underline"
          active={editor.isActive("underline")} />

        <Divider />

        {/* Lists */}
        <Btn action={() => editor.chain().focus().toggleBulletList().run()}
          label={<List size={iconSize} strokeWidth={iconStroke} />}
          title="Bullet List"
          active={editor.isActive("bulletList")} />
        <Btn action={() => editor.chain().focus().toggleOrderedList().run()}
          label={<ListOrdered size={iconSize} strokeWidth={iconStroke} />}
          title="Numbered List"
          active={editor.isActive("orderedList")} />

        <Divider />

        {/* Alignment */}
        <Btn action={() => editor.chain().focus().setTextAlign("left").run()}
          label={<AlignLeft size={iconSize} strokeWidth={iconStroke} />}
          title="Align left"
          active={editor.isActive({ textAlign: "left" })} />
        <Btn action={() => editor.chain().focus().setTextAlign("center").run()}
          label={<AlignCenter size={iconSize} strokeWidth={iconStroke} />}
          title="Align center"
          active={editor.isActive({ textAlign: "center" })} />
        <Btn action={() => editor.chain().focus().setTextAlign("right").run()}
          label={<AlignRight size={iconSize} strokeWidth={iconStroke} />}
          title="Align right"
          active={editor.isActive({ textAlign: "right" })} />

        <Divider />

        {/* Images */}
        <Btn 
        action={handleImageURL} 
        label={<Link size={iconSize} strokeWidth={iconStroke} />}
        title="Insert image from URL" />

        <label 
          title="Upload image from computer" 
          style={{
            minWidth: "32px", height: "32px", padding: "0 6px",
            borderRadius: "6px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: dk.text, background: "transparent",
            transition: "background 0.15s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <ImagePlus size={iconSize} strokeWidth={iconStroke} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
              />
        </label>
      </div>

      {/* Editor */}
      <div style={{
        background: dk.inputBg,
        border: `1px solid ${dk.cardBorder}`,
        borderRadius: "12px", color: dk.text,
      }}>
        <EditorContent editor={editor} />
      </div>
    </>
  );
}