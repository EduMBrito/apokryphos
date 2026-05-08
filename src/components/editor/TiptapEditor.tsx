"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

interface TiptapEditorProps {
  content: string;
  onChange: (richText: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  // Tenta transformar a string em objeto JSON (se for um post vindo do banco)
  // Se falhar (ex: string vazia ao criar um post novo), mantém o valor original
  let initialContent;
  try {
    initialContent = content ? JSON.parse(content) : "";
  } catch (e) {
    initialContent = content;
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "O que está oculto, reservado para si...",
      }),
    ],
    // Usamos a nossa variável traduzida aqui
    content: initialContent, 
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] font-sans text-lg leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-6 min-h-[500px]">
      <EditorContent editor={editor} />
    </div>
  );
}