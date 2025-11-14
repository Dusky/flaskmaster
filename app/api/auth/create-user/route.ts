import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().min(3).max(30),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, username } = createUserSchema.parse(body);

    // Create user in our database
    const user = await prisma.user.create({
      data: {
        id,
        email,
        username,
        passwordHash: "", // Not used since Supabase handles auth
        currencyBalance: 1000, // Starting balance
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
