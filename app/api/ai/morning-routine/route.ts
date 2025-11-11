import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const fallbackRoutines = [
  {
    routine: [
      {
        title: '🌅 Wake Up & Hydrate',
        description: 'Start your day with a glass of water to kickstart your metabolism',
        duration: '5 min',
      },
      {
        title: '🧘 Morning Meditation',
        description: 'Clear your mind with 10 minutes of mindfulness or breathing exercises',
        duration: '10 min',
      },
      {
        title: '💪 Quick Exercise',
        description: 'Get your blood flowing with a quick workout or yoga session',
        duration: '20 min',
      },
      {
        title: '🥗 Healthy Breakfast',
        description: 'Fuel your body with a nutritious, balanced breakfast',
        duration: '15 min',
      },
      {
        title: '📝 Daily Planning',
        description: 'Review your goals and plan your top 3 priorities for the day',
        duration: '10 min',
      },
    ],
    quote: 'The way you start your day determines how well you live your day.',
  },
  {
    routine: [
      {
        title: '☀️ Early Rise',
        description: 'Wake up 30 minutes earlier than usual to get ahead of the day',
        duration: '5 min',
      },
      {
        title: '📖 Read or Learn',
        description: 'Spend time reading or learning something new to stimulate your mind',
        duration: '15 min',
      },
      {
        title: '🏃 Active Movement',
        description: 'Go for a run, walk, or do your favorite physical activity',
        duration: '30 min',
      },
      {
        title: '🍳 Power Breakfast',
        description: 'Prepare a protein-rich breakfast to sustain your energy',
        duration: '15 min',
      },
      {
        title: '🎯 Goal Setting',
        description: 'Set clear intentions and visualize success for the day ahead',
        duration: '5 min',
      },
    ],
    quote: 'Success is the sum of small efforts repeated day in and day out.',
  },
];

export async function POST() {
  try {
    // Use fallback if OpenAI is not configured
    if (!openai) {
      const randomRoutine =
        fallbackRoutines[Math.floor(Math.random() * fallbackRoutines.length)];
      return NextResponse.json(randomRoutine);
    }

    // Use OpenAI to generate personalized routine
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a productivity expert. Create a personalized morning routine with 5 activities. For each activity, provide a title, description, and duration. Also provide an inspiring quote. Format as JSON.',
        },
        {
          role: 'user',
          content:
            'Generate a perfect morning routine for maximum productivity and wellness.',
        },
      ],
      max_tokens: 500,
    });

    const content = completion.choices[0].message.content;
    
    // Try to parse AI response, fallback if it fails
    try {
      const parsed = JSON.parse(content || '{}');
      return NextResponse.json(parsed);
    } catch {
      // If AI response isn't valid JSON, use fallback
      const randomRoutine =
        fallbackRoutines[Math.floor(Math.random() * fallbackRoutines.length)];
      return NextResponse.json(randomRoutine);
    }
  } catch (error: any) {
    console.error('Morning routine error:', error);
    
    // Return fallback on error
    const randomRoutine =
      fallbackRoutines[Math.floor(Math.random() * fallbackRoutines.length)];
    return NextResponse.json(randomRoutine);
  }
}

