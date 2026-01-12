import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/customers - Get all customers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const where: any = {};
    
    if (organizationId) {
      where.organizationId = organizationId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        select: {
          id: true,
          name: true,
          nameAr: true,
          email: true,
          phone: true,
          lastVisit: true,
          totalSpent: true,
          notes: true,
          totalBookings: true,
          tags: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit ? parseInt(limit) : undefined,
        skip: offset ? parseInt(offset) : undefined,
      }),
      prisma.customer.count({ where }),
    ]);

    const formattedCustomers = customers.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email || undefined,
      phone: customer.phone || undefined,
      lastVisit: customer.lastVisit?.toISOString().split('T')[0],
      totalSpent: customer.totalSpent,
      notes: customer.notes || undefined,
      bookingsCount: customer.totalBookings,
      tags: customer.tags,
      joinedDate: customer.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({
      customers: formattedCustomers,
      total,
      hasMore: offset ? parseInt(offset) + customers.length < total : false,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.organizationId) {
      return NextResponse.json(
        { error: 'Name and organizationId are required' },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        organizationId: body.organizationId,
        name: body.name,
        nameAr: body.nameAr,
        email: body.email,
        phone: body.phone,
        notes: body.notes,
        gender: body.gender,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        nationality: body.nationality,
        customFields: body.customFields || {},
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        city: body.city,
        state: body.state,
        country: body.country || 'SA',
        postalCode: body.postalCode,
        tags: body.tags || [],
      },
    });

    const formattedCustomer = {
      id: customer.id,
      name: customer.name,
      email: customer.email || undefined,
      phone: customer.phone || undefined,
      lastVisit: customer.lastVisit?.toISOString().split('T')[0],
      totalSpent: customer.totalSpent,
      notes: customer.notes || undefined,
    };

    return NextResponse.json(formattedCustomer, { status: 201 });
  } catch (error: any) {
    console.error('Error creating customer:', error);
    
    // Handle unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Customer with this email or phone already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
