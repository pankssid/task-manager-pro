import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    let user = storage.getUser(userId);

    // Create demo user if doesn't exist
    if (!user) {
      user = {
        id: userId,
        email: 'demo@example.com',
        name: 'Demo User',
        isPremium: false,
        createdAt: new Date().toISOString(),
      };
      storage.createUser(user);
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    const body = await request.json();

    const updatedUser = storage.updateUser(userId, body);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

