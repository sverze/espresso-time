import { NextRequest, NextResponse } from 'next/server';
import { EspressoShotService } from '@/lib/dynamodb/espressoShotService';

const espressoShotService = new EspressoShotService();

export async function GET() {
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
}

export async function POST(request: NextRequest) {
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
}