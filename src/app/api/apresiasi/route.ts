import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { apresiasiSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = apresiasiSchema.parse(body);

    const apresiasi = await prisma.apresiasi.create({
      data: validatedData,
    });

    return NextResponse.json(apresiasi, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send appreciation' }, { status: 500 });
  }
}
