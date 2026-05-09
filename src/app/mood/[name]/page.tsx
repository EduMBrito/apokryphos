import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface MoodPageProps {
  params: {
    name: string;
  };
}

const statusMap: Record<string, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
  DELETED: "Excluído",
};

const statusColorMap: Record<string, string> = {
  DRAFT: "bg-slate-700/40 text-slate-300 border-slate-500/50",
  PUBLISHED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DELETED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function MoodPage({ params }: MoodPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  // Decodifica o estado emocional da URL
  const decodedMood = decodeURIComponent(params.name);

  // Busca posts onde o mood coincide exatamente com o nome na URL
  const posts = await prisma.post.findMany({
    where: {
      status: { not: "DELETED" },
      mood: decodedMood,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return (
    <main className="max-w-4xl mx-auto py-12 px-6 min-h-screen">
      <div className="mb-8">
        <Button asChild variant="ghost" className="text-slate-400 hover:text-slate-100 mb-6">
          <Link href="/">&larr; Voltar para o Abismo</Link>
        </Button>
        
        <p className="text-indigo-400 text-sm font-medium uppercase tracking-wider mb-2">
          Estado Emocional
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-slate-100 italic">
          "{decodedMood}"
        </h1>
        <p className="text-slate-400 mt-4">
          {posts.length} {posts.length === 1 ? "registro encontrado" : "registros encontrados"} sob esta frequência.
        </p>
      </div>

      <section className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-slate-400 italic">Nenhum sedimento encontrado neste estado.</p>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
<article key={post.id} className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-800/60">
                <div>
                  <h3 className="text-xl font-serif text-slate-100 mb-1">{post.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 font-sans mb-3">
                    <time dateTime={post.createdAt.toISOString()}>
                      {post.createdAt.toLocaleDateString("pt-PT")}
                    </time>
                    {post.mood && (
                      <>
                        <span>•</span>
                        <Link 
                          href={`/mood/${post.mood}`}
                          className="text-indigo-400 font-medium transition-colors underline-offset-4 hover:underline hover:text-indigo-300 relative z-10"
                        >
                          {post.mood}
                        </Link>
                      </>
                    )}
                    <span>•</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColorMap[post.status] || statusColorMap.DRAFT}`}>
                      {statusMap[post.status]}
                    </span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((postTag: any) => (
                        <Link 
                          key={postTag.tag.id} 
                          href={`/tag/${postTag.tag.name}`}
                          className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors px-2 py-0.5 rounded-md text-xs font-medium border border-indigo-500/20 relative z-10"
                        >
                          #{postTag.tag.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
                  <Link href={`/post/${post.id}`}>Ler</Link>
                </Button>
              </article>))}
          </div>
        )}
      </section>
    </main>
  );
}