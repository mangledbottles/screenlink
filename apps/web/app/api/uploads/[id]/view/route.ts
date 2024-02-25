import { getUser } from '@/app/api/utils';
import { prisma } from '@/app/utils';
import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';


export async function POST(_: Request, { params }: { params: { id: string } }) {
    try {
        await getUser();

        const { id } = params;
        await prisma.upload.update({
            where: { id },
            data: {
                views: {
                    increment: 1
                }
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.log(error)
        if (error.type === 'not_found') {
            return NextResponse.json({
                error: 'Upload not found. This upload may not exist or may have been deleted.'
            }, { status: 404 });
        }
        captureException(new Error(`Add view to upload ${error?.message}`), {
            data: {
                error,
            },
        });

        return NextResponse.json({
            error: error?.message || 'Something went wrong'
        }, {
            status: 500
        });
    }
}