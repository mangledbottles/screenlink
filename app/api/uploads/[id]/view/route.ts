import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function POST(_: Request, { params }: { params: { id: string } }) {
    try {
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
        return NextResponse.json({
            error: error?.message || 'Something went wrong'
        }, {
            status: 500
        });
    }
}