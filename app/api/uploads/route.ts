import { Devices, PrismaClient, User, Upload as PrismaUpload } from '@prisma/client'
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

const verifyDeviceCode = async (deviceCode: string): Promise<(Partial<Devices> & { user: Partial<User> }) | null> => {
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
            user: {
                select: {
                    currentProjectId: true,
                    id: true,
                }
            }
        }
    });
    if (!device) return null;

    return device;
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    try {
        const body = await new Response(req.body).json();
        const authorization = req.headers.get('authorization');
        // deviceCode is after "Bearer "
        const deviceCode = authorization?.split(' ')[1];
        const device = await verifyDeviceCode(deviceCode!);
        if (!device) {
            return NextResponse.json({
                error: 'Device not found'
            }, { status: 404 });
        }

        const { sourceTitle } = body;
        console.log({ body, sourceTitle })

        const upload = await createUploadLink();
        if (upload.error) throw new Error(upload.error.message);

        const projectId = device.user.currentProjectId;
        if (!projectId) return NextResponse.json({
            error: 'Project not found'
        }, { status: 404 });

        console.log(JSON.stringify(device, null, 2))

        const video = await prisma.upload.create({
            data: {
                uploadLink: upload.url,
                assetId: upload?.asset_id || '',
                uploadId: upload.id,
                provider: 'mux',
                sourceTitle: sourceTitle,
                projectId,
                userId: device.user.id,
                deviceId: device.id,
            }
        });

        await prisma.devices.update({
            where: {
                id: device.id
            },
            data: {
                lastUploadAt: new Date(),
                uploads: {
                    connect: {
                        id: video.id
                    }
                }
            }
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