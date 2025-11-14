import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json();

    // Validation
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Email, password, and username are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await query(
      `SELECT id FROM users WHERE email = $1 OR username = $2`,
      [email, username]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 12);

    // Create user
    const users = await query<any>(
      `INSERT INTO users (id, email, username, password_hash, currency_balance, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, 1000, NOW())
       RETURNING id, email, username`,
      [email, username, passwordHash]
    );

    const user = users[0];

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
