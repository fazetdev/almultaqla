import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getToken } from 'next-auth/jwt';

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: 30 days ago
    const end = endDate ? new Date(endDate) : new Date();

    // Calculate date range for weekly revenue
    const weeks = 8; // Last 8 weeks
    const weeklyRevenue = [];
    
    for (let i = weeks - 1; i >= 0; i--) {
      const weekStart = new Date(end);
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const revenue = await prisma.payment.aggregate({
        where: {
          organizationId,
          status: 'PAID',
          date: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
        _sum: {
          amount: true,
        },
      });
      
      weeklyRevenue.push(revenue._sum.amount || 0);
    }

    // Get staff performance
    const staffPerformanceData = await prisma.staffPerformance.findMany({
      where: {
        organizationId,
        periodType: 'MONTHLY',
        period: {
          gte: start,
        },
      },
      include: {
        staff: {
          select: {
            id: true,
            name: true,
            nameAr: true,
          },
        },
      },
      orderBy: {
        period: 'desc',
      },
      take: 10, // Top 10 staff
    });

    const staffPerformance = staffPerformanceData.map(performance => ({
      id: performance.staffId,
      name: performance.staff.name,
      revenue: performance.revenue,
      bookings: performance.bookingsCount,
    }));

    // Get popular services
    const popularServices = await prisma.service.findMany({
      where: {
        organizationId,
        bookings: {
          some: {
            date: {
              gte: start,
              lte: end,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        nameAr: true,
        price: true,
        _count: {
          select: {
            bookings: {
              where: {
                date: {
                  gte: start,
                  lte: end,
                },
              },
            },
          },
        },
        bookings: {
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
          select: {
            amount: true,
          },
        },
      },
      orderBy: {
        bookings: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const formattedPopularServices = popularServices.map(service => ({
      id: service.id,
      name: service.name,
      count: service._count.bookings,
      revenue: service.bookings.reduce((sum, booking) => sum + booking.amount, 0),
    }));

    // Get peak hours
    const peakHoursData = await prisma.booking.groupBy({
      by: ['date'],
      where: {
        organizationId,
        date: {
          gte: start,
          lte: end,
        },
      },
      _count: {
        id: true,
      },
    });

    // Aggregate by hour
    const hourCounts: Record<number, number> = {};
    peakHoursData.forEach(booking => {
      const hour = booking.date.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + booking._count.id;
    });

    const peakHours = Object.entries(hourCounts)
      .map(([hour, bookings]) => ({
        hour: parseInt(hour),
        bookings,
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 8); // Top 8 hours

    // Calculate overall stats
    const [totalRevenue, totalBookings, totalCustomers, totalStaff] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          organizationId,
          status: 'PAID',
          date: {
            gte: start,
            lte: end,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      prisma.booking.count({
        where: {
          organizationId,
          date: {
            gte: start,
            lte: end,
          },
        },
      }),
      prisma.customer.count({
        where: {
          organizationId,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      prisma.staff.count({
        where: {
          organizationId,
          isActive: true,
        },
      }),
    ]);

    const analyticsData = {
      weeklyRevenue,
      staffPerformance,
      popularServices: formattedPopularServices,
      peakHours,
      summary: {
        totalRevenue: totalRevenue._sum.amount || 0,
        totalBookings,
        totalCustomers,
        totalStaff,
        averageBookingValue: totalBookings > 0 ? (totalRevenue._sum.amount || 0) / totalBookings : 0,
        conversionRate: 0, // Would need more data for this
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}