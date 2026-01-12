import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

// GET /api/services - Get all services
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const category = searchParams.get('category');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (organizationId) {
      where.organizationId = organizationId;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { descriptionAr: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      select: {
        id: true,
        name: true,
        nameAr: true,
        category: true,
        categoryAr: true,
        subcategory: true,
        type: true,
        duration: true,
        price: true,
        currency: true,
        description: true,
        descriptionAr: true,
        isActive: true,
        requiresStaff: true,
        imageUrl: true,
        customFields: true,
        bookingSlots: true,
        createdAt: true,
        staff: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            role: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        category: 'asc',
      },
    });

    const formattedServices = services.map(service => ({
      id: service.id,
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price,
      description: service.description || undefined,
      nameAr: service.nameAr || undefined,
      descriptionAr: service.descriptionAr || undefined,
      categoryAr: service.categoryAr || undefined,
      subcategory: service.subcategory || undefined,
      type: service.type || undefined,
      currency: service.currency,
      isActive: service.isActive,
      requiresStaff: service.requiresStaff,
      imageUrl: service.imageUrl || undefined,
      customFields: service.customFields,
      bookingSlots: service.bookingSlots,
      staff: service.staff.map(staff => ({
        id: staff.id,
        name: staff.name,
        nameAr: staff.nameAr || undefined,
        role: staff.role,
      })),
      bookingsCount: service._count.bookings,
    }));

    return NextResponse.json(formattedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'ORGANIZATION_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.name || !body.category || !body.duration || !body.price || !body.organizationId) {
      return NextResponse.json(
        { error: 'Name, category, duration, price, and organizationId are required' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        organizationId: body.organizationId,
        name: body.name,
        nameAr: body.nameAr,
        category: body.category,
        categoryAr: body.categoryAr,
        subcategory: body.subcategory,
        type: body.type,
        duration: parseInt(body.duration),
        price: parseFloat(body.price),
        description: body.description,
        descriptionAr: body.descriptionAr,
        isActive: body.isActive !== undefined ? body.isActive : true,
        requiresStaff: body.requiresStaff !== undefined ? body.requiresStaff : true,
        currency: body.currency || 'SAR',
        imageUrl: body.imageUrl,
        customFields: body.customFields || {},
        bookingSlots: body.bookingSlots,
      },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedService = {
      id: service.id,
      name: service.name,
      category: service.category,
      duration: service.duration,
      price: service.price,
      description: service.description || undefined,
      nameAr: service.nameAr || undefined,
      descriptionAr: service.descriptionAr || undefined,
      isActive: service.isActive,
      requiresStaff: service.requiresStaff,
      imageUrl: service.imageUrl || undefined,
      staff: service.staff.map(staff => ({
        id: staff.id,
        name: staff.name,
      })),
    };

    return NextResponse.json(formattedService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
