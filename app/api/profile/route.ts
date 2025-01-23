import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// Helper function to verify JWT and extract userId
const verifyJwt = (token: string) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Server configuration error. Missing JWT secret key.");
    }
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    // Extract JWT from the Authorization header
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Token is missing. Please log in." },
        { status: 401 }
      );
    }

    // Verify JWT token and extract userId
    const decoded = verifyJwt(token) as jwt.JwtPayload & { userId: string };

    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token. The token may have expired or is malformed." },
        { status: 401 }
      );
    }

    if (typeof decoded === "string") {
      return NextResponse.json(
        { error: "Invalid token structure. The token is not a valid JWT." },
        { status: 401 }
      );
    }

    if (!decoded.userId) {
      return NextResponse.json(
        { error: "User ID is missing in the token. Please log in again." },
        { status: 401 }
      );
    }

    const { userId } = decoded; // Extract userId from decoded token

    // Parse the incoming request body
    const { fullName, bio, skills, experience } = await req.json();

    if (!skills || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: "Skills are required and should be an array." },
        { status: 400 }
      );
    }

    if (!experience || !Array.isArray(experience)) {
      return NextResponse.json(
        { error: "Experience is required and should be an array." },
        { status: 400 }
      );
    }

    // Check if skills exist and handle them
    const skillIds = await Promise.all(
      skills.map(async (skillName: string) => {
        let skill = await prisma.skill.findUnique({
          where: { name: skillName },
        });

        if (!skill) {
          skill = await prisma.skill.create({
            data: { name: skillName },
          });
        }
        return skill.id;
      })
    );

    // Create or update the user's profile in the database
    const profile = await prisma.profile.create({
      data: {
        userId,
        bio,
        skills: {
          connect: skillIds.map((id) => ({ id })),
        },
        experience: {
          create: experience.map((exp: any) => ({
            title: exp.title,
            company: exp.company,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description,
          })),
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error during profile submission:", error);
    return NextResponse.json(
      { error: "Failed to submit profile. Please try again later." },
      { status: 400 }
    );
  }
}
