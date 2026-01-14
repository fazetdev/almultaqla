// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone, organizationName, industry } = body;

    // 1️⃣ Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // 3️⃣ Transactional Creation (User + optional Organization + Customer)
    const result = await prisma.$transaction(async (tx) => {
      let createdOrgId: string | null = null;

      // 3a️⃣ Create Organization if provided
      if (organizationName && industry) {
        const organization = await tx.organization.create({
          data: {
            name: organizationName,
            industry: industry.toUpperCase() as any, // Type-safe cast
            isActive: true,
          },
        });
        createdOrgId = organization.id;
      }

      // 3b️⃣ Create User
      const userData: any = {
        name,
        email,
        phone,
        passwordHash,
        role: createdOrgId ? "ORGANIZATION_ADMIN" : "CUSTOMER",
        isVerified: false,
        isActive: true,
      };
      if (createdOrgId) userData.organizationId = createdOrgId;

      const user = await tx.user.create({ data: userData });

      // 3c️⃣ Create Customer Profile ONLY for standalone users
      if (!createdOrgId) {
        // Find default organization for unassigned customers
        let defaultOrg = await tx.organization.findFirst({ where: { name: "Public" } });

        // If default org doesn't exist, create it
        if (!defaultOrg) {
          defaultOrg = await tx.organization.create({
            data: { name: "Public", industry: "RETAIL_STORE", isActive: true },
          });
        }

        await tx.customer.create({
          data: {
            name,
            email,
            phone,
            userId: user.id,
            organizationId: defaultOrg.id, // ✅ Required field now satisfied
          },
        });
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: createdOrgId,
      };
    });

    // 4️⃣ Return success response
    return NextResponse.json({ success: true, user: result }, { status: 201 });
  } catch (err) {
    console.error("REGISTER_ERROR:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
