import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReadOnlyEditor from "@/components/editor/ReadOnlyEditor";
import { getServerSession } from "next-auth"; // Importação necessária
import { authOptions } from "@/lib/auth"; // Importação necessária

interface PostPageProps {
  params: {
    id: string;
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

export default async function PostPage({ params }: PostPageProps) {
  // 1. A TRAVA DE SEGURANÇA: Verifica se você está logado
  const session = await getServerSession(authOptions);

  // Se não houver sessão, tratamos como post não encontrado (proteção de privacidade)
  if (!session) {
    notFound();
  }

  // 2. Busca o post incluindo as tags
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!post || post.status === "DELETED") {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <Button asChild variant="ghost" className="text-slate-400 hover:text-slate-100">
          <Link href="/">&larr; Voltar para o Abismo</Link>
        </Button>
        
        {/* Atalho para edição */}
        <Button asChild variant="outline">
          <Link href={`/edit/${post.id}`}>Editar Post</Link>
        </Button>
      </div>

      <article>
        <header className="mb-10 border-b border-slate-800 pb-6">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-100 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 font-sans mb-4">
            <time dateTime={post.createdAt.toISOString()}>
              {post.createdAt.toLocaleDateString("pt-PT")}
            </time>
            {post.mood && (
              <>
                <span>•</span>
                <Link 
                  href={`/mood/${post.mood}`}
                  className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors underline-offset-4 hover:underline"
                >
                  {post.mood}
                </Link>
              </>
            )}
            <span>•</span>
            <span className={`px-2 py-0.5 rounded-full border uppercase text-xs font-medium ${statusColorMap[post.status] || statusColorMap.DRAFT}`}>
              {statusMap[post.status]}
            </span>
          </div>

          {/* Renderização das Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((postTag) => (
                <Link 
                  key={postTag.tag.id} 
                  href={`/tag/${postTag.tag.name}`}
                  className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors px-2 py-0.5 rounded-md text-xs font-medium border border-indigo-500/20"
                >
                  #{postTag.tag.name}
                </Link>
              ))}
            </div>
          )}
        </header>

        <ReadOnlyEditor content={post.content} />
      </article>
    </main>
  );
}