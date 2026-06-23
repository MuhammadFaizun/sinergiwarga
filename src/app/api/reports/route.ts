import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { reportSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reports = await prisma.fasumReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        apresiasi: true,
      }
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = reportSchema.parse(body);

    const report = await prisma.fasumReport.create({
      data: validatedData,
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
