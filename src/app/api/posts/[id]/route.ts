import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PostStatus } from "@prisma/client";

// Lê um post específico (GET)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// Atualiza um post (PATCH)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, content, status, mood } = body;

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content,
        status,
        mood,
        // Se o status mudar para PUBLISHED, registramos a data de publicação automaticamente
        ...(status === PostStatus.PUBLISHED ? { publishedAt: new Date() } : {})
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// Exclui um post logicamente - Soft Delete (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Em vez de deletar fisicamente, alteramos o status para DELETED
    const deletedPost = await prisma.post.update({
      where: { id: params.id },
      data: { status: PostStatus.DELETED },
    });

    return NextResponse.json(deletedPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}