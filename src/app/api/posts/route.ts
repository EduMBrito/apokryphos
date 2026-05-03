import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Lê todos os posts (GET)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc", // Retorna os mais recentes primeiro
      },
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// Cria um novo post (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, mood } = body;

    // A tipagem do Prisma impede que passemos campos inexistentes aqui
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        mood,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}