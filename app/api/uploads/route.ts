import { PrismaClient } from '@prisma/client'
import Mux, { Upload } from '@mux/mux-node';
import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()
const { Video } = new Mux(process.env.MUX_ACCESS_TOKEN!, process.env.MUX_SECRET_KEY!);

const createUploadLink = async (): Promise<Upload> => {
    const upload = await Video.Uploads.create({
        cors_origin: '*',
        new_asset_settings: {
            playback_policy: 'public',
            max_resolution_tier: "1080p",
        },
        timeout: '3600',
    });

    return upload;
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    try {
        const body = await new Response(req.body).json();
        const { sourceTitle } = body;
        console.log({ body, sourceTitle })

        const upload = await createUploadLink();
        if (upload.error) throw new Error(upload.error.message);
        const payload = {
            uploadLink: upload.url,
            assetId: upload?.asset_id || '',
            uploadId: upload.id,
            provider: 'mux',
            sourceTitle,
        }

        const video = await prisma.upload.create({
            data: payload
        });
        return NextResponse.json({
            uploadLink: upload.url,
            id: video.id,
        });

    } catch (error: any) {
        console.log(error)
        return NextResponse.json({
            status: 500,
            body: {
                error: error?.message || 'Something went wrong'
            }
        });
    }
}