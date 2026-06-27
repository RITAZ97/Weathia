import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.isTrialUsed) {
      return NextResponse.json({ error: 'You have already used your free trial' }, { status: 400 });
    }
    const trialDuration = new Date();
    trialDuration.setDate(trialDuration.getDate() + 14);

    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        isPremium: true,
        premiumExpiresAt: trialDuration,
        isTrialUsed: true 
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}