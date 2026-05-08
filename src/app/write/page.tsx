"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react"; // Biblioteca de ícones nativa do shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WritePage() {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Novos estados para gerenciar as Hashtags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState("DRAFT");

  // Captura a tecla Enter para transformar o texto em uma Tag
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Impede o envio acidental de formulários
      const newTag = tagInput.trim().toLowerCase();

      // Só adiciona se não for vazio e se a tag já não existir no array
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput(""); // Limpa o campo de digitação
    }
  };

  // Remove a tag do array quando clica no X
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title || !content) {
      alert("Por favor, preencha o título e o conteúdo.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          mood,
          status,
          tags, // Agora enviamos o array de tags para a API
        }),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        throw new Error("Falha ao salvar o post");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar seu pensamento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-slate-100">
          Novo Pensamento
        </h1>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Registrar no Abismo"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="bg-slate-800/40 border-slate-700">
          <CardContent className="pt-6 space-y-6">
            
            {/* Título */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-slate-400">Título do Sedimento</Label>
              <Input
                id="title"
                placeholder="Dê um nome ao que sente..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-slate-100 focus:ring-indigo-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mood */}
              <div className="grid gap-2">
                <Label htmlFor="mood" className="text-slate-400">Estado Emocional</Label>
                <Input
                  id="mood"
                  placeholder="Ex: Melancólico, Focado..."
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-slate-100 focus:ring-indigo-500"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-slate-400">Status Inicial</Label>
                <Select value={status} onValueChange={(val) => setStatus(val)}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-slate-100 focus:ring-indigo-500">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Rascunho (Oculto)</SelectItem>
                    <SelectItem value="PUBLISHED">Publicar Imediatamente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Hashtags Dinâmicas */}
              <div className="grid gap-2">
                <Label htmlFor="tags" className="text-slate-400">
                  Hashtags <span className="text-xs text-slate-500 font-normal">(Pressione Enter para adicionar)</span>
                </Label>
                <div className="flex flex-col gap-3 bg-slate-900/50 border border-slate-700 rounded-md p-2.5 focus-within:ring-1 focus-within:ring-indigo-500 transition-shadow">
                  
                  {/* Container invisível de input */}
                  <input
                    id="tags"
                    type="text"
                    placeholder="Ex: filosofia, dev..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent text-slate-100 outline-none w-full placeholder:text-slate-600 text-sm px-1"
                  />
                  
                  {/* Lista de Pílulas (Badges) Renderizadas */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800">
                      {tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-md text-xs font-medium border border-indigo-500/20"
                        >
                          #{tag}
                          <button 
                            type="button" 
                            onClick={() => removeTag(tag)} 
                            className="text-indigo-400/70 hover:text-indigo-300 transition-colors ml-1"
                          >
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

        {/* Editor */}
        <div className="grid gap-2">
          <Label className="text-slate-400 ml-1">Conteúdo Oculto</Label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>
    </main>
  );
}