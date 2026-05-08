import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ReadOnlyEditor from "@/components/editor/ReadOnlyEditor";

// Tipagem que o Next.js exige para rotas dinâmicas
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
  // Busca o post específico pelo ID que veio na URL
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

  // Se o ID for inválido, direciona para uma página 404 automática
  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto py-12 px-6 min-h-screen">
      <Button asChild variant="ghost" className="mb-8 text-slate-400 hover:text-slate-100">
        <Link href="/">&larr; Voltar para o Abismo</Link>
      </Button>
      <Button asChild variant="outline"><Link href={"/edit/" + post.id}>Editar Post</Link></Button>

      <article>
        <header className="mb-10 border-b border-slate-800 pb-6">
          <h1 className="text-4xl md:text-5xl font-serif text-slate-100 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 font-sans">
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
            <span className={`px-2 py-0.5 rounded-full border uppercase text-xs font-medium ${statusColorMap[post.status] || statusColorMap.DRAFT}`}>
              {statusMap[post.status]}
            </span>
          </div>
          {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((postTag) => (
                        <span 
                          key={postTag.tag.id} 
                          className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md text-xs font-medium border border-indigo-500/20"
                        >
                          #{postTag.tag.name}
                        </span>
                      ))}
                    </div>
            )}
        </header>

        {/* O nosso componente que lê o JSON e o transforma em HTML bonito */}
        <ReadOnlyEditor content={post.content} />
      </article>
    </main>
  );
}