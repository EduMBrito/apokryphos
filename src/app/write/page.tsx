"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function WritePage() {
  const router = useRouter();
  
  // Estados para os campos do nosso Post
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        }),
      });

      if (response.ok) {
        // Após salvar, voltamos para a home (onde listaremos os posts na Fase 3)
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
        {/* Seção de Título e Mood */}
        <Card className="bg-slate-800/40 border-slate-700">
          <CardContent className="pt-6 space-y-4">
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
            
            <div className="grid gap-2">
              <Label htmlFor="mood" className="text-slate-400">Estado Emocional</Label>
              <Input
                id="mood"
                placeholder="Ex: Melancólico, Eufórico, Focado..."
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-slate-100 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* O Nosso Editor Rico */}
        <div className="grid gap-2">
          <Label className="text-slate-400 ml-1">Conteúdo Oculto</Label>
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>
    </main>
  );
}