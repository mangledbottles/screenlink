import { PrismaClient } from '@prisma/client'
import Mux, { Upload } from '@mux/mux-node';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()
const { Video } = new Mux(process.env.MUX_ACCESS_TOKEN!, process.env.MUX_SECRET_KEY!);

const getUpload = async (uploadId: string): Promise<Upload> => {
    const upload = await Video.Uploads.get(uploadId);
    return upload;
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const upload = await prisma.upload.findUnique({ where: { id } });

        if (!upload) {
            return NextResponse.json({
                status: 404,
                body: {
                    error: 'Upload not found'
                }
            });
        }

        const muxUpload = await getUpload(upload.uploadId);
        if (muxUpload.status === 'asset_created') {

            const video = await Video.Assets.get(muxUpload.asset_id!);
            const playbackId = video?.playback_ids?.[0]?.id;

            console.log({ video, muxUpload })

            const updated = await prisma.upload.update({
                where: { id },
                data: {
                    status: 'asset_created',
                    assetId: muxUpload.asset_id,
                    playbackId,
                }
            });

            return NextResponse.json({ ...updated, isReady: video.status === 'ready' });

        }

        return NextResponse.json(upload);
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