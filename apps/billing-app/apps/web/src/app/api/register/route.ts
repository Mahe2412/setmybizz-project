import { prisma } from "@billease/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name, businessName } = await req.json();

    if (!email || !password || !businessName) {
      return NextResponse.json(
        { error: "Email, password, and business name are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
        memberships: {
          create: {
            role: "owner",
            business: {
              create: {
                name: businessName,
                stateCode: "27",
              },
            },
          },
        },
      },
      include: {
        memberships: { include: { business: true } },
      },
    });

    return NextResponse.json({
      ok: true,
      userId: user.id,
      businessId: user.memberships[0]?.businessId,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
