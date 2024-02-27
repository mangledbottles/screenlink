import { NextApiResponse } from 'next';
import { prisma } from '@/app/utils';
import { getUser } from '../../utils';
import { captureException } from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod'; // Import Zod
import { Role } from '@prisma/client';

// Define the request body schema using Zod
const requestBodySchema = z.object({
  offset: z.number().optional(),
  limit: z.number().optional(),
  projectId: z.string(), // projectId is required
  authorIds: z.array(z.string()).optional(), // authorIds are optional
});

// Handles POST requests for fetching user uploads with pagination and filtering support
export async function POST(req: NextRequest, res: NextApiResponse) {
    try {
        // console.log(req.body)
        const body = await new Response(req.body).json();
        // const body = await
        // Validate the request body against the schema
        const validatedBody = requestBodySchema.safeParse(body);
        if (!validatedBody.success) {
            // Extract and format Zod error messages
            const errorMessages = validatedBody.error.errors.map(error => `${error.path.join('.')}: ${error.message}`).join(', ');
            return NextResponse.json({ error: "Validation failed", details: errorMessages }, {
                status: 400
            });
        }

        const user = await getUser();
        // @ts-ignore
        const userId = user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { offset = 0, limit = 10, projectId, authorIds } = validatedBody.data;

        // Check if the user is an owner of the project
        const projectUserRole = await prisma.projectUsers.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId: projectId,
                },
            },
        });

        if (projectUserRole?.role !== Role.owner && authorIds && authorIds.some(authorId => authorId !== userId)) {
            return NextResponse.json({ error: "Forbidden: User is not an owner of the project" }, { status: 403 })
        }

        // Construct the where clause for filtering uploads
        const whereClause = {
            projectId,
            userId: authorIds?.length ? { in: authorIds } : userId,
        };

        // Fetch a paginated list of uploads based on the request body parameters
        const uploads = await prisma.upload.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        // Fetching the total count of uploads for pagination
        const totalCount = await prisma.upload.count({ where: whereClause });

        if (!uploads.length) return NextResponse.json({ uploads: [], total: 0 });

        // Respond with the list of uploads and the total count for pagination
        return NextResponse.json({ uploads, total: totalCount });
    } catch (error: any) {
        // Handle Zod validation errors
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten() }, { status: 400 });
        }
        console.error(error);
        captureException(new Error(`Fetching Uploads: ${error?.message}`), { data: { error: error?.message } });
        return NextResponse.json({ error: error?.message }, { status: 500 });
    }
}