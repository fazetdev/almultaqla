import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, organizationName, industry } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Start transaction for user and optional organization creation
    const result = await prisma.$transaction(async (tx) => {
      let organizationId: string | undefined;
      
      // Create organization if provided
      if (organizationName && industry) {
        const organization = await tx.organization.create({
          data: {
            name: organizationName,
            industry: industry.toUpperCase(),
            isActive: true,
          },
        });
        organizationId = organization.id;
      }

      // Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          passwordHash,
          role: organizationId ? 'ORGANIZATION_ADMIN' : 'CUSTOMER',
          organizationId,
          isVerified: false,
          isActive: true,
        },
        include: {
          organization: organizationId ? {
            select: {
              id: true,
              name: true,
              industry: true,
            },
          } : false,
        },
      });

      // If user is customer, create customer profile
      if (!organizationId) {
        await tx.customer.create({
          data: {
            name,
            email,
            phone,
            organizationId: organizationId || '', // Will need organization context
            userId: user.id,
          },
        });
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          organization: user.organization,
        },
        organizationId,
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: result.user,
      organizationId: result.organizationId,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
