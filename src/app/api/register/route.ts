import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }
    const lowerEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: lowerEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 400 } 
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: lowerEmail,
        password: hashedPassword
      }
    });

    console.log("Database user creation successful:", newUser.id);

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("DATABASE EXCEPTION IN REGISTER API:", error.message || error);
    
    return NextResponse.json(
      { 
        message: "Database connection failed or internal server error.", 
        details: error.message || "Unknown error"
      }, 
      { status: 500 }
    );
  }
}