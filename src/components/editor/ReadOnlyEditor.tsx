"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ReadOnlyEditorProps {
  content: string; // O JSON que vem do banco de dados
}

export default function ReadOnlyEditor({ content }: ReadOnlyEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    // Parseamos a string JSON de volta para objeto
    content: JSON.parse(content),
    editable: false, // Trava o editor para apenas leitura
    immediatelyRender: false, // Previne o erro de Hydration que vimos antes
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none font-sans text-lg leading-relaxed focus:outline-none",
      },
    },
  });

  return <EditorContent editor={editor} />;
}