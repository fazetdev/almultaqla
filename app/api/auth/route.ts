import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            nameAr: true,
            industry: true,
          },
        },
        staffProfile: {
          select: {
            id: true,
            role: true,
            isActive: true,
          },
        },
        customerProfile: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Create JWT token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      name: user.name,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

    // Create session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        userAgent: request.headers.get('user-agent') || undefined,
        ipAddress: request.headers.get('x-forwarded-for') || undefined,
      },
    });

    // Prepare user data for response
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      nameAr: user.nameAr,
      role: user.role,
      avatarUrl: user.avatarUrl,
      organization: user.organization ? {
        id: user.organization.id,
        name: user.organization.name,
        nameAr: user.organization.nameAr,
        industry: user.organization.industry,
      } : null,
      isStaff: !!user.staffProfile,
      isCustomer: !!user.customerProfile,
      preferences: user.preferences,
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      token,
      refreshToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    // Set HTTP-only cookies
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/auth/refresh - Refresh token
export async function PUT(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value || 
                         request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 401 }
      );
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Find session
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            organizationId: true,
            name: true,
            isActive: true,
          },
        },
      },
    });

    if (!session || !session.user.isActive) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    // Check if refresh token is expired
    if (session.expiresAt < new Date()) {
      await prisma.session.delete({ where: { id: session.id } });
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Create new token
    const tokenPayload = {
      userId: session.user.id,
      email: session.user.email,
      role: session.user.role,
      organizationId: session.user.organizationId,
      name: session.user.name,
    };

    const newToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });
    const newRefreshToken = jwt.sign({ userId: session.user.id }, JWT_SECRET, { expiresIn: '30d' });

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const response = NextResponse.json({
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: 7 * 24 * 60 * 60,
    });

    // Update cookies
    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Token refresh failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/auth/logout - User logout
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (token) {
      // Delete session
      await prisma.session.deleteMany({
        where: { token },
      });
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear cookies
    response.cookies.delete('token');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
