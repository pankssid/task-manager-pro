import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Fallback responses if OpenAI is not configured
    if (!openai) {
      const fallbackResponses: any = {
        'Plan my perfect morning routine': {
          response: `Here's your perfect morning routine:

1. Wake up at 6:00 AM - Start your day early
2. Hydrate - Drink a glass of water
3. Exercise - 20 minutes of light workout
4. Healthy breakfast - Fuel your body
5. Plan your day - Review your tasks
6. Focus time - Tackle your most important task

This routine will help you start your day with energy and purpose!`,
          tasks: [
            'Morning workout (20 minutes)',
            'Healthy breakfast preparation',
            'Daily planning session',
            'Review top 3 priorities',
          ],
        },
        'Suggest productive tasks for today': {
          response: `Based on productivity best practices, here are suggested tasks:

1. Complete your most important task first (eat the frog!)
2. Check and respond to emails (time-boxed to 30 mins)
3. Work on a learning goal
4. Take regular breaks (Pomodoro technique)
5. Review and plan for tomorrow

Focus on quality over quantity!`,
          tasks: [
            'Complete priority #1 task',
            'Email management (30 min)',
            'Learn something new (15 min)',
            'Evening review & planning',
          ],
        },
        'Help me prioritize my goals': {
          response: `Let's prioritize using the Eisenhower Matrix:

**Urgent & Important:** Do these first
**Important but Not Urgent:** Schedule these
**Urgent but Not Important:** Delegate if possible
**Neither:** Eliminate these

Focus on important tasks that align with your long-term goals!`,
          tasks: [
            'Identify top 3 priorities',
            'Schedule important tasks',
            'Eliminate time-wasters',
          ],
        },
        'Give me a quick energy boost plan': {
          response: `Quick energy boost plan:

1. Take a 5-minute walk
2. Drink water - dehydration causes fatigue
3. Do 10 jumping jacks
4. Listen to upbeat music
5. Eat a healthy snack (fruit/nuts)
6. Step outside for fresh air

You'll feel refreshed in 10 minutes!`,
          tasks: [
            '5-minute walk break',
            'Hydration check',
            'Quick stretch session',
            'Healthy snack',
          ],
        },
      };

      // Find matching response
      const matchingKey = Object.keys(fallbackResponses).find((key) =>
        prompt.toLowerCase().includes(key.toLowerCase().slice(0, 15))
      );

      if (matchingKey) {
        return NextResponse.json(fallbackResponses[matchingKey]);
      }

      // Default fallback
      return NextResponse.json({
        response: `Great question! Here's my suggestion:

Focus on breaking down your goals into smaller, actionable tasks. Start with the most important task that will move you closer to your goal. Remember to:

- Set specific, measurable objectives
- Take regular breaks to maintain focus
- Celebrate small wins along the way
- Stay consistent and patient

You've got this! 🚀`,
        tasks: ['Break down main goal', 'Identify next action step', 'Set deadline'],
      });
    }

    // Use OpenAI if configured
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful AI productivity assistant. Provide practical, actionable advice for task management and productivity. Be encouraging and motivating. Keep responses concise and actionable.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
    });

    const response = completion.choices[0].message.content || 'No response generated';

    // Extract potential tasks from the response
    const taskMatches = response.match(/^\d+\.\s+(.+)$/gm);
    const tasks = taskMatches
      ? taskMatches.map((t) => t.replace(/^\d+\.\s+/, '').trim())
      : [];

    return NextResponse.json({ response, tasks });
  } catch (error: any) {
    console.error('AI suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI suggestion' },
      { status: 500 }
    );
  }
}

