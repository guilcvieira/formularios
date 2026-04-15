'use server';

import prisma from '@/lib/prisma';
import { formSchema, FormSchema } from '@/schemas/form.schema';
import { currentUser } from '@clerk/nextjs/server';

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  const user = await currentUser();

  if (!user) {
    return {
      throw: new UserNotFoundErr(),
    };
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      submissions: true,
    },
  });

  const visits = stats._sum.visits || 0;
  const submissions = stats._sum.submissions || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;
  return {
    visits,
    submissions,
    submissionRate: submissionRate.toFixed(2),
    bounceRate: bounceRate.toFixed(2),
  };
}

export async function CreateForm(data: FormSchema) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error('Invalid form data');
  }

  const user = await currentUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { name, description } = data;

  const form = await prisma.form.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!form) {
    throw new Error('Failed to create form');
  }

  return form.id;
}

export async function GetForms() {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundErr();
  }

  const forms = await prisma.form.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return forms;
}

export async function GetFormById(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function GetFormContentByURL(formUrl: string) {
  if (!formUrl) {
    throw new Error('Form URL is required');
  }

  const form = await prisma.form.findFirst({
    where: {
      shareUrl: formUrl,
    },
    select: {
      id: true,
      content: true,
    },
  });

  if (!form) {
    throw new Error('Form not found');
  }

  await prisma.form.update({
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      id: form.id,
    },
  });

  return {
    id: form.id,
    content: form.content,
  };
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundErr();
  }

  const form = await prisma.form.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      content: jsonContent,
    },
  });

  if (!form) {
    throw new Error('Failed to update form content');
  }

  return form;
}

export async function PublishForm(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundErr();
  }

  const form = await prisma.form.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      published: true,
    },
  });

  if (!form) {
    throw new Error('Failed to publish form');
  }

  return form;
}

export async function SubmitFunction(
  formUrl: string,
  content: string,
  timeToComplete?: number,
  device?: string,
) {
  const form = await prisma.form.findFirst({
    where: {
      shareUrl: formUrl,
      published: true,
    },
    select: {
      id: true,
    },
  });

  if (!form) {
    throw new Error('Form not found or not published');
  }

  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1,
      },
      FormSubmission: {
        create: {
          content,
          timeToComplete: timeToComplete ?? null,
          device: device ?? 'unknown',
        },
      },
    },
    where: {
      id: form.id,
    },
  });
}

export async function GetFormWithSubissions(formId: number) {
  const user = await currentUser();

  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.form.findUnique({
    where: {
      id: formId,
      userId: user.id,
    },
    include: {
      FormSubmission: true,
    },
  });
}
