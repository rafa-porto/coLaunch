import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { name, bio, website, twitter, github, linkedin } = body;
    
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }
    
    // Atualizar o perfil do usuário
    const [updatedUser] = await db.update(user)
      .set({
        name: name.trim(),
        bio: bio?.trim() || null,
        website: website?.trim() || null,
        twitter: twitter?.trim() || null,
        github: github?.trim() || null,
        linkedin: linkedin?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))
      .returning();
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil" },
      { status: 500 }
    );
  }
}
