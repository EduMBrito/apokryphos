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
    
    // Agora esperamos receber também um array de 'tags' (ex: ["foco", "filosofia"])
    const { title, content, mood, tags = [] } = body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        mood,
        status: "DRAFT",
        // Magia do Prisma: Criamos o Post e as Tags ao mesmo tempo
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}