"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "O que está oculto, reservado para si...",
      }),
    ],
    content: content,
    // Estilização do editor via Tailwind
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] font-sans text-lg leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      // Retornamos o conteúdo em formato JSON para o banco de dados futuramente
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-6 min-h-[500px]">
      <EditorContent editor={editor} />
    </div>
  );
}