import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/staff - Get all staff members
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const role = searchParams.get('role');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (organizationId) {
      where.organizationId = organizationId;
    }
    
    if (role) {
      where.role = role;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { role: { contains: search, mode: 'insensitive' } },
      ];
    }

    const staff = await prisma.staff.findMany({
      where,
      select: {
        id: true,
        name: true,
        nameAr: true,
        role: true,
        email: true,
        phone: true,
        performanceScore: true,
        title: true,
        bio: true,
        bioAr: true,
        isActive: true,
        avatarUrl: true,
        schedule: true,
        workingHours: true,
        customFields: true,
        createdAt: true,
        services: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
        performances: {
          orderBy: {
            period: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedStaff = staff.map(staffMember => {
      const latestPerformance = staffMember.performances[0];
      
      return {
        id: staffMember.id,
        name: staffMember.name,
        role: staffMember.role,
        email: staffMember.email || undefined,
        phone: staffMember.phone || undefined,
        performanceScore: staffMember.performanceScore,
        title: staffMember.title || undefined,
        bio: staffMember.bio || undefined,
        isActive: staffMember.isActive,
        avatarUrl: staffMember.avatarUrl || undefined,
        services: staffMember.services.map(service => ({
          id: service.id,
          name: service.name,
        })),
        monthlyRevenue: latestPerformance?.revenue || 0,
        monthlyBookings: latestPerformance?.bookingsCount || 0,
        rating: latestPerformance?.rating || 0,
        schedule: staffMember.schedule,
        workingHours: staffMember.workingHours,
        customFields: staffMember.customFields,
      };
    });

    return NextResponse.json(formattedStaff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

// POST /api/staff - Create a new staff member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.role || !body.organizationId) {
      return NextResponse.json(
        { error: 'Name, role, and organizationId are required' },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.create({
      data: {
        organizationId: body.organizationId,
        name: body.name,
        nameAr: body.nameAr,
        role: body.role,
        email: body.email,
        phone: body.phone,
        title: body.title,
        bio: body.bio,
        bioAr: body.bioAr,
        isActive: body.isActive !== undefined ? body.isActive : true,
        performanceScore: body.performanceScore || 0,
        schedule: body.schedule,
        workingHours: body.workingHours,
        customFields: body.customFields || {},
        avatarUrl: body.avatarUrl,
        documents: body.documents,
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedStaff = {
      id: staff.id,
      name: staff.name,
      role: staff.role,
      email: staff.email || undefined,
      phone: staff.phone || undefined,
      performanceScore: staff.performanceScore,
      title: staff.title || undefined,
      bio: staff.bio || undefined,
      isActive: staff.isActive,
      avatarUrl: staff.avatarUrl || undefined,
      services: staff.services.map(service => ({
        id: service.id,
        name: service.name,
      })),
    };

    return NextResponse.json(formattedStaff, { status: 201 });
  } catch (error: any) {
    console.error('Error creating staff:', error);
    
    // Check if it's a Prisma unique constraint error
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Staff with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create staff' },
      { status: 500 }
    );
  }
}
