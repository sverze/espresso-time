import { NextResponse } from 'next/server';
import { EspressoShotService } from '@/lib/dynamodb/espressoShotService';
import { withAuth, AuthenticatedRequest } from '@/lib/middleware';

const espressoShotService = new EspressoShotService();

export const GET = withAuth(async (_request: AuthenticatedRequest) => {
  try {
    console.log('🔧 GET /api/espresso-shots called');
    const shots = await espressoShotService.getAllShots();
    console.log('🔧 Successfully retrieved shots:', shots.length);
    return NextResponse.json(shots);
  } catch (error) {
    console.error('🔧 API Error getting espresso shots:', error);
    console.error('🔧 Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Failed to get espresso shots', details: error instanceof Error ? error.message : String(error) },
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

export const DELETE = withAuth(async (request: AuthenticatedRequest) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }

    await espressoShotService.deleteShot(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('API Error deleting espresso shot:', error);
    return NextResponse.json(
      { error: 'Failed to delete espresso shot' },
      { status: 500 }
    );
  }
});