import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { getDevice, getUser } from '../../utils';
import { captureException } from '@sentry/nextjs';

export async function POST(req: NextRequest, res: NextApiResponse) {
    try {
        await getUser();

        const body = await new Response(req.body).json();
        const { deviceCode } = body;

        const device = await getDevice(deviceCode);

        if (!device) {
            return NextResponse.json({
                error: 'Device not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            isVerified: true, ...device
        });
    } catch (error: any) {
        captureException(new Error(`Device Verify: ${error?.message}`), {
            data: {
                error,
            },
        });
        console.log(error)
        return NextResponse.json({
            error: error?.message || 'Something went wrong'
        }, { status: 500 });
    }
}