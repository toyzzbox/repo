'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import MenuBar from './menu-bar'

interface RichTextEditorProps {
  description: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  description,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: description,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
    onCreate({ editor }) {
      onChange(editor.getHTML()); // ✅ başlangıçta description'ı form state'ine gönder
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML()); // ✅ kullanıcı değiştirince tekrar güncelle
    },
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
