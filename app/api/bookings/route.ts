import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db/prisma';

// GET /api/bookings - Get all bookings with filters
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const customerId = searchParams.get('customerId');
    const staffId = searchParams.get('staffId');
    
    // Validate organizationId for non-admin users
    if (token.role !== 'SUPER_ADMIN' && !organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // Build filters
    const where: any = {};
    
    // Organization filter
    if (organizationId) {
      where.organizationId = organizationId;
    } else if (token.role === 'SUPER_ADMIN') {
      // Super admin can see all
    } else {
      where.organizationId = token.organizationId;
    }
    
    if (status) {
      where.status = status.toUpperCase();
    }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    
    if (customerId) {
      where.customerId = customerId;
    }
    
    if (staffId) {
      where.staffId = staffId;
    }

    // Get bookings with related data
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            role: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            duration: true,
            price: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Transform to match frontend Booking interface
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      customerId: booking.customerId,
      date: booking.date.toISOString().split('T')[0], // YYYY-MM-DD
      time: booking.date.toTimeString().split(' ')[0].slice(0, 5), // HH:MM
      type: booking.type,
      status: booking.status.toLowerCase(),
      amount: booking.amount,
      notes: booking.notes || undefined,
      customerName: booking.customer.name,
      staffName: booking.staff?.name || '',
      serviceName: booking.service?.name || '',
    }));

    return NextResponse.json(formattedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['customerId', 'date', 'type', 'amount'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Determine organizationId
    const organizationId = body.organizationId || token.organizationId;
    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // Parse date and time
    const bookingDate = new Date(`${body.date}T${body.time || '00:00'}`);
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        organizationId,
        customerId: body.customerId,
        date: bookingDate,
        type: body.type,
        status: 'PENDING',
        amount: parseFloat(body.amount),
        notes: body.notes,
        staffId: body.staffId,
        serviceId: body.serviceId,
        industryType: body.industryType || 'SALON_SPA',
        customFields: body.customFields || {},
      },
      include: {
        customer: {
          select: {
            name: true,
            nameAr: true,
          },
        },
      },
    });

    // Format response to match frontend interface
    const formattedBooking = {
      id: booking.id,
      customerId: booking.customerId,
      date: booking.date.toISOString().split('T')[0],
      time: booking.date.toTimeString().split(' ')[0].slice(0, 5),
      type: booking.type,
      status: booking.status.toLowerCase(),
      amount: booking.amount,
      notes: booking.notes || undefined,
    };

    return NextResponse.json(formattedBooking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
