import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const prisma = new PrismaClient();
        const url = new URL(request.url);
        const animated = url.searchParams.get('animated') === 'true';

        let upload = await prisma.upload.findUnique({
            where: { id },
        });

        if (!upload || !upload.playbackId) {
            throw new Error('Upload or playback ID not found');
        }

        const thumbnailType = animated ? 'animated.gif?width=600&height=400'
         : 'thumbnail.jpg';
        const thumbnailUrl = `https://image.mux.com/${upload.playbackId}/${thumbnailType}`;
        const imageResponse = await fetch(thumbnailUrl);
        const imageBuffer = await imageResponse.arrayBuffer();

        return new Response(imageBuffer, {
            headers: { 'Content-Type': `image/${animated ? 'gif' : 'jpeg'}` },
            status: 200
        });
    } catch (error) {
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
}
