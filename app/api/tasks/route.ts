import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    const tasks = storage.getTasks(userId);
    
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'demo-user';
    const body = await request.json();
    
    const { title, description, priority } = body;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Check task limit for non-premium users
    const user = storage.getUser(userId);
    const tasks = storage.getTasks(userId);
    
    if (!user?.isPremium && tasks.length >= 5) {
      return NextResponse.json(
        { error: 'Free plan limited to 5 tasks. Upgrade to Premium for unlimited tasks.' },
        { status: 403 }
      );
    }

    const newTask = {
      id: uuidv4(),
      title,
      description: description || '',
      completed: false,
      priority: priority || 'medium',
      createdAt: new Date().toISOString(),
      userId,
    };

    storage.addTask(userId, newTask);

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

