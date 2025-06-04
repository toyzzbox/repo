"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, LinkIcon, ImageIcon } from "lucide-react";
import { useCallback } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Görsel URL’si:");
    if (url && url.trim() !== "") {
      editor?.chain().focus().setImage({ src: url.trim() }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const toolbarButton = (
    icon: React.ReactNode,
    onClick: () => void,
    active: boolean,
    title: string
  ) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 transition ${
        active ? "bg-gray-200 text-black" : "text-gray-500"
      }`}
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b pb-2">
        {toolbarButton(
          <Bold size={16} />,
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold"),
          "Bold"
        )}
        {toolbarButton(
          <Italic size={16} />,
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic"),
          "Italic"
        )}
        {toolbarButton(
          <UnderlineIcon size={16} />,
          () => editor.chain().focus().toggleUnderline().run(),
          editor.isActive("underline"),
          "Underline"
        )}
        {toolbarButton(
          <Heading1 size={16} />,
          () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          editor.isActive("heading", { level: 1 }),
          "Heading 1"
        )}
        {toolbarButton(
          <Heading2 size={16} />,
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading", { level: 2 }),
          "Heading 2"
        )}
        {toolbarButton(
          <LinkIcon size={16} />,
          () => {
            const url = window.prompt("Bağlantı:");
            if (url && url.trim()) {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
            }
          },
          editor.isActive("link"),
          "Link"
        )}
        {toolbarButton(
          <ImageIcon size={16} />,
          addImage,
          false,
          "Görsel Ekle"
        )}
      </div>

      {/* Editor */}
      <div className="border rounded min-h-[200px] p-3 focus-within:ring-2 focus-within:ring-orange-500 transition">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
