import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { updateStatusSchema } from '@/lib/validations';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate the request
    const adminToken = req.cookies.get('admin_token')?.value;
    if (adminToken !== 'authenticated_session_token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const unwrappedParams = await params;
    const body = await req.json();
    const validatedData = updateStatusSchema.parse(body);
    
    const updatedReport = await prisma.fasumReport.update({
      where: { id: unwrappedParams.id },
      data: { 
        status: validatedData.status,
        ...(validatedData.adminReply !== undefined && { adminReply: validatedData.adminReply }),
        ...(validatedData.afterImageUrl !== undefined && { afterImageUrl: validatedData.afterImageUrl })
      },
    });

    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update report status' }, { status: 500 });
  }
}
