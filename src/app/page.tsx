import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export default async function Home() {
  // 1. Verificamos se o mestre do abismo está presente
  const session = await getServerSession(authOptions);

  let posts: any[] = [];

  // 2. Só vamos ao banco de dados gastar recursos se a sessão existir
  if (session) {
    posts = await prisma.post.findMany({
      where: {
        status: { not: "DELETED" },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tags: { include: { tag: true } },
      },
    });
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-6 min-h-screen">
      <header className="flex flex-col items-center justify-center mb-16 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-semibold mb-6">
          Apokryphos
        </h1>
        <p className="font-sans text-lg md:text-xl text-slate-300 max-w-2xl mb-8">
          O que está oculto, reservado para si. Uma camada de sedimento dos seus pensamentos.
        </p>
        
        {/* O botão de escrever só aparece se logado */}
        {session && (
          <Button asChild variant="default" size="lg">
            <Link href="/write">Escrever Pensamento</Link>
          </Button>
        )}
      </header>

      {/* 3. Renderização Condicional da Listagem */}
      {session ? (
        <section className="space-y-6">
          <h2 className="text-2xl font-serif text-slate-100 border-b border-slate-800 pb-2">
            Meus Sedimentos
          </h2>
          
          {posts.length === 0 ? (
            <p className="text-slate-400 italic">O abismo ainda está vazio...</p>
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
                          <span className="text-indigo-400 font-medium">{post.mood}</span>
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
                          <span key={postTag.tag.id} className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md text-xs font-medium border border-indigo-500/20">
                            #{postTag.tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
                    <Link href={`/post/${post.id}`}>Ler</Link>
                  </Button>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : (
        // O que os curiosos veem quando você não está logado
        <div className="text-center py-16 border border-slate-800/50 rounded-2xl bg-slate-900/20">
          <p className="text-slate-500 font-serif text-xl italic">
            O abismo encontra-se selado.
          </p>
        </div>
      )}
    </main>
  );
}