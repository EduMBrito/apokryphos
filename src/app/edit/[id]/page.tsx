import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPostForm from "@/components/editor/EditPostForm";

interface EditPageProps {
  params: { id: string };
}

export default async function EditPage({ params }: EditPageProps) {
  // 1. O Servidor busca o post no banco de dados ANTES da página renderizar
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      tags: { include: { tag: true } },
    },
  });

  if (!post) {
    notFound();
  }

  // 2. Preparamos (formatamos) os dados para o formulário
  const formattedData = {
    id: post.id,
    title: post.title,
    content: post.content,
    mood: post.mood,
    status: post.status as "DRAFT" | "PUBLISHED" | "DELETED",
    tags: post.tags.map((pt) => pt.tag.name), // Extraímos apenas os nomes das tags
  };

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      {/* 3. Passamos o bastão: O componente Client recebe os dados prontos */}
      <EditPostForm initialData={formattedData} />
    </main>
  );
}