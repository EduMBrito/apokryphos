"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Definimos o formato dos dados iniciais que o Servidor vai nos entregar
interface EditPostFormProps {
  initialData: {
    id: string;
    title: string;
    content: string;
    mood: string | null;
    status: "DRAFT" | "PUBLISHED" | "DELETED";
    tags: string[]; // Recebemos um array de strings limpo
  };
}

export default function EditPostForm({ initialData }: EditPostFormProps) {
  const router = useRouter();

  // Os estados já começam preenchidos com os dados que vieram do banco
  const [title, setTitle] = useState(initialData.title);
  const [mood, setMood] = useState(initialData.mood || "");
  const [content, setContent] = useState(initialData.content);
  const [status, setStatus] = useState(initialData.status);
  const [tags, setTags] = useState<string[]>(initialData.tags);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleUpdate = async () => {
    if (!title || !content) {
      alert("Título e conteúdo são obrigatórios.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${initialData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, mood, status, tags }),
      });

      if (response.ok) {
        router.push(`/post/${initialData.id}`);
        router.refresh(); // Força o Next.js a atualizar o cache da página de leitura
      } else {
        throw new Error("Erro ao atualizar");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar as modificações.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    // Alerta de confirmação nativo do navegador para evitar cliques acidentais
    const isConfirmed = window.confirm("Tem certeza que deseja apagar este sedimento? Ele ficará oculto do abismo.");
    
    if (!isConfirmed) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${initialData.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/"); // Volta para a Home
        router.refresh(); // Força a atualização da lista
      } else {
        throw new Error("Erro ao excluir");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o pensamento.");
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-serif text-3xl font-bold text-slate-100">
          Reescrever Sedimento
        </h1>
        <div className="space-x-4">
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            Excluir
          </Button>
          <Button variant="ghost" onClick={() => router.back()}>Cancelar</Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      <Card className="bg-slate-800/40 border-slate-700">
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-2">
            <Label className="text-slate-400">Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="grid gap-2">
              <Label className="text-slate-400">Estado Emocional</Label>
              <Input
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-slate-100"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-400">Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Rascunho (Oculto)</SelectItem>
                  <SelectItem value="PUBLISHED">Publicado (Visível)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-400">Hashtags</Label>
              <div className="flex flex-col gap-3 bg-slate-900/50 border border-slate-700 rounded-md p-2.5">
                <input
                  type="text"
                  placeholder="Pressione Enter..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-slate-100 outline-none w-full text-sm px-1"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800">
                    {tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-md text-xs font-medium border border-indigo-500/20">
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="text-indigo-400/70 hover:text-indigo-300 ml-1">
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-2">
        <Label className="text-slate-400 ml-1">Conteúdo Oculto</Label>
        {/* Passamos o conteúdo inicial para o Tiptap */}
        <TiptapEditor content={content} onChange={setContent} />
      </div>
    </div>
  );
}