import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }
    const premiumDuration = new Date();
    premiumDuration.setDate(premiumDuration.getDate() + 30); 

    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { 
        isPremium: true,
        premiumExpiresAt: premiumDuration 
      },
    });

    console.log(`User ${email} has successfully activated Premium status!`);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Error activating premium status:', error.message || error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}