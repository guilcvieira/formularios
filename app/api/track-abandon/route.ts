import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formUrl, sessionId } = body;

    if (
      !formUrl ||
      !sessionId ||
      typeof formUrl !== 'string' ||
      typeof sessionId !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const form = await prisma.form.findFirst({
      where: { shareUrl: formUrl, published: true },
      select: { id: true },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    await prisma.formEvent.create({
      data: {
        formId: form.id,
        sessionId,
        type: 'form_abandon',
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
