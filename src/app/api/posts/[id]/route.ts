import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

// Lê um post específico (GET) - Mantido igual
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        tags: { include: { tag: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Falha ao buscar post" }, { status: 500 });
  }
}

// Atualiza um post (PATCH) - REFATORADO PARA HASHTAGS
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content, status, mood, tags = [] } = body;

    // Transação: Garantimos que ou tudo corre bem, ou nada é alterado
    const updatedPost = await prisma.$transaction(async (tx) => {
      
      // 1. Limpeza: Removemos as conexões antigas de tags deste post
      await tx.postTag.deleteMany({
        where: { postId: params.id },
      });

      // 2. Atualização: Post + Novas conexões de Tags
      return await tx.post.update({
        where: { id: params.id },
        data: {
          title,
          content,
          status,
          mood,
          // Se o status mudar para PUBLISHED, registramos a data
          ...(status === PostStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
          tags: {
            create: tags.map((tagName: string) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName.toLowerCase() },
                  create: { name: tagName.toLowerCase() },
                },
              },
            })),
          },
        },
      });
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Erro no PATCH:", error);
    return NextResponse.json({ error: "Falha ao atualizar post" }, { status: 500 });
  }
}

// Exclui um post logicamente - Soft Delete (DELETE) - Mantido igual
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deletedPost = await prisma.post.update({
      where: { id: params.id },
      data: { status: PostStatus.DELETED },
    });

    return NextResponse.json(deletedPost);
  } catch (error) {
    return NextResponse.json({ error: "Falha ao eliminar post" }, { status: 500 });
  }
}