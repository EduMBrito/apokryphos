import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

export default async function Home() {
  // Busca todos os posts no banco de dados, ordenados do mais recente para o mais antigo
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="max-w-4xl mx-auto py-12 px-6 min-h-screen">
      <header className="flex flex-col items-center justify-center mb-16 text-center">
        <h1 className="font-serif text-5xl md:text-7xl font-semibold mb-6">
          Apokryphos
        </h1>
        
        <p className="font-sans text-lg md:text-xl text-slate-300 max-w-2xl mb-8">
          O que está oculto, reservado para si. Uma camada de sedimento dos seus pensamentos.
        </p>

        <Button asChild variant="default" size="lg">
          <Link href="/write">
            Escrever Pensamento
          </Link>
        </Button>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-slate-100 border-b border-slate-800 pb-2">
          Meus Sedimentos
        </h2>
        
        {posts.length === 0 ? (
          <p className="text-slate-400 italic">O abismo ainda está vazio...</p>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <article 
                key={post.id} 
                className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-800/60"
              >
                <div>
                  <h3 className="text-xl font-serif text-slate-100 mb-1">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-400 font-sans">
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700">
                      {post.status}
                    </span>
                  </div>
                </div>
                
                {/* Futuramente, este botão levará para a página de leitura do post */}
                <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
                  <Link href={`/post/${post.id}`}>
                  Ler
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}