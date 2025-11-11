import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { tasks } = await request.json();

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({
        insights: {
          productivityScore: 'N/A',
          avgCompletionTime: 'N/A',
          focusArea: 'Get started',
          peakHours: 'N/A',
          recommendations: ['Start by creating your first task!'],
        },
      });
    }

    // Calculate productivity metrics
    const completedTasks = tasks.filter((t: Task) => t.completed);
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    // Calculate productivity score
    let productivityScore = '0%';
    if (completionRate >= 80) productivityScore = '🔥 Excellent!';
    else if (completionRate >= 60) productivityScore = '💪 Great!';
    else if (completionRate >= 40) productivityScore = '👍 Good!';
    else if (completionRate >= 20) productivityScore = '📈 Building...';
    else productivityScore = '🌱 Starting...';

    // Analyze priority distribution
    const highPriority = tasks.filter((t: Task) => t.priority === 'high').length;
    const mediumPriority = tasks.filter((t: Task) => t.priority === 'medium').length;
    const lowPriority = tasks.filter((t: Task) => t.priority === 'low').length;

    let focusArea = 'Balanced';
    if (highPriority > mediumPriority && highPriority > lowPriority) {
      focusArea = '🎯 High Priority';
    } else if (lowPriority > highPriority && lowPriority > mediumPriority) {
      focusArea = '🌿 Low Priority';
    }

    // Calculate average completion time (simplified)
    const avgCompletionTime = completedTasks.length > 0 ? '1-2 days' : 'N/A';

    // Peak hours estimation based on creation times
    const hours = tasks.map((t: Task) => new Date(t.createdAt).getHours());
    const morningTasks = hours.filter((h) => h >= 6 && h < 12).length;
    const afternoonTasks = hours.filter((h) => h >= 12 && h < 18).length;
    const eveningTasks = hours.filter((h) => h >= 18 || h < 6).length;

    let peakHours = '🌅 Morning';
    if (afternoonTasks > morningTasks && afternoonTasks > eveningTasks) {
      peakHours = '☀️ Afternoon';
    } else if (eveningTasks > morningTasks && eveningTasks > afternoonTasks) {
      peakHours = '🌙 Evening';
    }

    // Generate AI recommendations
    const recommendations: string[] = [];

    if (completionRate < 50) {
      recommendations.push('Break large tasks into smaller, manageable chunks');
      recommendations.push('Start with quick wins to build momentum');
    }

    if (highPriority > 3 && completedTasks.length === 0) {
      recommendations.push('Focus on completing one high-priority task first');
    }

    if (tasks.length > 10 && completionRate < 30) {
      recommendations.push('Consider reviewing and removing outdated tasks');
    }

    if (completionRate > 70) {
      recommendations.push('Amazing work! Keep up the momentum 🚀');
      recommendations.push('Consider setting more challenging goals');
    }

    if (recommendations.length === 0) {
      recommendations.push('Stay consistent with your daily planning');
      recommendations.push('Review and update your tasks regularly');
      recommendations.push('Celebrate your progress, no matter how small!');
    }

    const insights = {
      productivityScore,
      avgCompletionTime,
      focusArea,
      peakHours,
      recommendations,
    };

    return NextResponse.json({ insights });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze tasks' }, { status: 500 });
  }
}

