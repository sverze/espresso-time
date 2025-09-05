import { NextResponse } from 'next/server';
import { EspressoShotService } from '@/lib/dynamodb/espressoShotService';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

const espressoShotService = new EspressoShotService();

export const GET = withAuth(async (_request: AuthenticatedRequest) => {
  try {
    const shots = await espressoShotService.getAllShots();
    return NextResponse.json(shots);
  } catch (error) {
    console.error('API Error getting espresso shots:', error);
    return NextResponse.json(
      { error: 'Failed to get espresso shots' },
      { status: 500 }
    );
  }
});

export const POST = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const shotData = await request.json();
    const newShot = await espressoShotService.createShot(shotData);
    return NextResponse.json(newShot, { status: 201 });
  } catch (error) {
    console.error('API Error creating espresso shot:', error);
    return NextResponse.json(
      { error: 'Failed to create espresso shot' },
      { status: 500 }
    );
  }
});