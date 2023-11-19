import { PrismaClient } from '@prisma/client'
import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function POST(req: NextRequest, res: NextApiResponse) {
    try {
        const body = await new Response(req.body).json();
        const { deviceCode } = body;

        const device = await prisma.devices.findFirst({
            where: {
                code: deviceCode
            },
            select: {
                id: true,
                name: true,
                code: true,
                createdAt: true,
                updatedAt: true,
                user: true,
            }
        });

        if (!device) {
            return NextResponse.json({
                error: 'Device not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            isVerified: true, ...device
        });


    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            error: error?.message || 'Something went wrong'
        }, { status: 500 });
    }
}