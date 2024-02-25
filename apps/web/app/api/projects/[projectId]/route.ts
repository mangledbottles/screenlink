import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { getDevice, getUser } from '../../utils';
import { captureException } from '@sentry/nextjs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define Zod schema for project update validation
const projectUpdateSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

export async function PUT(req: NextRequest, { params }: { params: { projectId: string } }, res: NextApiResponse) {
    try {
        // Validate user
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Extract projectId from URL
        const { projectId } = params;

        // Parse and validate request body
        const body = await new Response(req.body).json();
        const validationResult = projectUpdateSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({ error: validationResult.error.flatten() }, { status: 400 });
        }

        // Update project in the database
        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: { name: validationResult.data.name },
        });

        // Respond with updated project data
        return NextResponse.json(updatedProject);
    } catch (error: any) {
        captureException(new Error(`Project Update: ${error?.message}`), {
            data: { error },
        });
        console.error(error);
        return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
    }
}