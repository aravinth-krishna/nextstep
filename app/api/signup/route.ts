import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const SALT_ROUNDS = 10;

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        fullName,
        role: "USER", // Default role
      },
    });

    // Generate JWT token
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET_KEY is not defined.");
    }
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "User created successfully.", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
