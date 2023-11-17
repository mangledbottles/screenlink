import { PrismaClient } from '@prisma/client'
import Mux, { Upload } from '@mux/mux-node';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()
const { Video } = new Mux(process.env.MUX_ACCESS_TOKEN!, process.env.MUX_SECRET_KEY!);

const getUpload = async (uploadId: string): Promise<Upload> => {
    try {
        const upload = await Video.Uploads.get(uploadId);
        return upload;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const upload = await prisma.upload.findUnique({ where: { id } });

        if (!upload) {
            throw { type: 'not_found' };
        }

        const muxUpload = await getUpload(upload.uploadId);
        if (muxUpload.status === 'asset_created') {

            const video = await Video.Assets.get(muxUpload.asset_id!);
            const playbackId = video?.playback_ids?.[0]?.id;

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