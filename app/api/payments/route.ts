import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient();

// GET /api/payments - Get all payments
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');
    const method = searchParams.get('method');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const customerId = searchParams.get('customerId');
    const bookingId = searchParams.get('bookingId');

    const where: any = {};
    
    if (organizationId) {
      where.organizationId = organizationId;
    }
    
    if (status) {
      where.status = status;
    }
    
    if (method) {
      where.method = method;
    }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.date = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      where.date = {
        lte: new Date(endDate),
      };
    }
    
    if (customerId) {
      where.customerId = customerId;
    }
    
    if (bookingId) {
      where.bookingId = bookingId;
    }

    const payments = await prisma.payment.findMany({
      where,
      select: {
        id: true,
        amount: true,
        currency: true,
        method: true,
        methodAr: true,
        status: true,
        date: true,
        receiptNumber: true,
        transactionId: true,
        gateway: true,
        createdAt: true,
        paidAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            phone: true,
          },
        },
        booking: {
          select: {
            id: true,
            date: true,
            type: true,
            status: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const formattedPayments = payments.map(payment => ({
      id: payment.id,
      bookingId: payment.booking?.id || undefined,
      customerId: payment.customer.id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status.toLowerCase(),
      date: payment.date.toISOString().split('T')[0],
      receiptNumber: payment.receiptNumber,
      transactionId: payment.transactionId || undefined,
      gateway: payment.gateway || undefined,
      customerName: payment.customer.name,
      customerNameAr: payment.customer.nameAr || undefined,
      bookingType: payment.booking?.type || undefined,
      bookingDate: payment.booking?.date.toISOString().split('T')[0] || undefined,
      paidAt: payment.paidAt?.toISOString().split('T')[0] || undefined,
    }));

    // Calculate summary statistics
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidCount = payments.filter(p => p.status === 'PAID').length;
    const pendingCount = payments.filter(p => p.status === 'PENDING').length;

    return NextResponse.json({
      payments: formattedPayments,
      summary: {
        total: payments.length,
        totalAmount,
        paidCount,
        pendingCount,
        failedCount: payments.filter(p => p.status === 'FAILED').length,
        refundedCount: payments.filter(p => p.status === 'REFUNDED').length,
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/payments - Create a new payment
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'ORGANIZATION_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.amount || !body.method || !body.customerId || !body.organizationId) {
      return NextResponse.json(
        { error: 'Amount, method, customerId, and organizationId are required' },
        { status: 400 }
      );
    }

    // Generate receipt number
    const receiptNumber = `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const payment = await prisma.payment.create({
      data: {
        organizationId: body.organizationId,
        amount: parseFloat(body.amount),
        method: body.method,
        methodAr: body.methodAr,
        status: body.status || 'PENDING',
        date: body.date ? new Date(body.date) : new Date(),
        currency: body.currency || 'SAR',
        receiptNumber,
        customerId: body.customerId,
        bookingId: body.bookingId,
        transactionId: body.transactionId,
        gateway: body.gateway,
        gatewayData: body.gatewayData,
        paidAt: body.status === 'PAID' ? new Date() : null,
      },
      include: {
        customer: {
          select: {
            name: true,
            nameAr: true,
          },
        },
        booking: {
          select: {
            type: true,
            date: true,
          },
        },
      },
    });

    // Update customer's total spent if payment is paid
    if (payment.status === 'PAID') {
      await prisma.customer.update({
        where: { id: payment.customerId },
        data: {
          totalSpent: {
            increment: payment.amount,
          },
        },
      });
      
      // Update booking status if linked
      if (payment.bookingId) {
        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: {
            status: 'CONFIRMED',
          },
        });
      }
    }

    const formattedPayment = {
      id: payment.id,
      bookingId: payment.bookingId || undefined,
      customerId: payment.customerId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status.toLowerCase(),
      date: payment.date.toISOString().split('T')[0],
      receiptNumber: payment.receiptNumber,
      transactionId: payment.transactionId || undefined,
      gateway: payment.gateway || undefined,
    };

    return NextResponse.json(formattedPayment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
