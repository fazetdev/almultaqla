import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// GET /api/bookings/[id] - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            email: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            role: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            duration: true,
            price: true,
            category: true,
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            receiptNumber: true,
            date: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const formattedBooking = {
      id: booking.id,
      customerId: booking.customerId,
      date: booking.date.toISOString().split('T')[0],
      time: booking.date.toTimeString().split(' ')[0].slice(0, 5),
      type: booking.type,
      status: booking.status.toLowerCase(),
      amount: booking.amount,
      notes: booking.notes || undefined,
      endDate: booking.endDate?.toISOString().split('T')[0],
      endTime: booking.endDate?.toTimeString().split(' ')[0].slice(0, 5),
      industryType: booking.industryType,
      customFields: booking.customFields,
      cancelledAt: booking.cancelledAt?.toISOString(),
      confirmedAt: booking.confirmedAt?.toISOString(),
      completedAt: booking.completedAt?.toISOString(),
      customer: {
        id: booking.customer.id,
        name: booking.customer.name,
        nameAr: booking.customer.nameAr || undefined,
        email: booking.customer.email || undefined,
        phone: booking.customer.phone || undefined,
      },
      staff: booking.staff ? {
        id: booking.staff.id,
        name: booking.staff.name,
        nameAr: booking.staff.nameAr || undefined,
        role: booking.staff.role,
        email: booking.staff.email || undefined,
        phone: booking.staff.phone || undefined,
      } : undefined,
      service: booking.service ? {
        id: booking.service.id,
        name: booking.service.name,
        nameAr: booking.service.nameAr || undefined,
        duration: booking.service.duration,
        price: booking.service.price,
        category: booking.service.category,
      } : undefined,
      payment: booking.payment ? {
        id: booking.payment.id,
        amount: booking.payment.amount,
        status: booking.payment.status,
        method: booking.payment.method,
        receiptNumber: booking.payment.receiptNumber,
        date: booking.payment.date.toISOString().split('T')[0],
      } : undefined,
      organization: {
        id: booking.organization.id,
        name: booking.organization.name,
        industry: booking.organization.industry,
      },
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Check if booking exists and get its current data
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      select: { 
        organizationId: true,
        date: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (body.date || body.time) {
      const dateStr = body.date || existingBooking.date.toISOString().split('T')[0];
      const timeStr = body.time || existingBooking.date.toTimeString().split(' ')[0].slice(0, 5);
      updateData.date = new Date(`${dateStr}T${timeStr}`);
    }
    
    if (body.status) {
      updateData.status = body.status.toUpperCase();
      
      // Set status timestamps
      const now = new Date();
      if (body.status === 'cancelled') updateData.cancelledAt = now;
      if (body.status === 'confirmed') updateData.confirmedAt = now;
      if (body.status === 'completed') updateData.completedAt = now;
    }
    
    if (body.type) updateData.type = body.type;
    if (body.amount !== undefined) updateData.amount = parseFloat(body.amount);
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.staffId !== undefined) updateData.staffId = body.staffId;
    if (body.serviceId !== undefined) updateData.serviceId = body.serviceId;
    if (body.customFields !== undefined) updateData.customFields = body.customFields;

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: {
          select: {
            name: true,
            nameAr: true,
          },
        },
      },
    });

    const formattedBooking = {
      id: updatedBooking.id,
      customerId: updatedBooking.customerId,
      date: updatedBooking.date.toISOString().split('T')[0],
      time: updatedBooking.date.toTimeString().split(' ')[0].slice(0, 5),
      type: updatedBooking.type,
      status: updatedBooking.status.toLowerCase(),
      amount: updatedBooking.amount,
      notes: updatedBooking.notes || undefined,
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      select: { organizationId: true, status: true },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Soft delete - mark as cancelled
    const cancelledBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
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

    const formattedBooking = {
      id: cancelledBooking.id,
      customerId: cancelledBooking.customerId,
      date: cancelledBooking.date.toISOString().split('T')[0],
      time: cancelledBooking.date.toTimeString().split(' ')[0].slice(0, 5),
      type: cancelledBooking.type,
      status: cancelledBooking.status.toLowerCase(),
      amount: cancelledBooking.amount,
      notes: cancelledBooking.notes || undefined,
      cancelledAt: cancelledBooking.cancelledAt?.toISOString(),
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}
