import Mux, { Upload } from '@mux/mux-node';
import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import { TRANSACTIONAL_EMAIL_FIRST_UPLOAD_TEMPLATE_ID, baseUrl, loops, prisma } from '@/app/utils';
import { getDevice, getUser } from '../utils';
import { captureException } from '@sentry/nextjs';

const { Video } = new Mux(process.env.MUX_ACCESS_TOKEN!, process.env.MUX_SECRET_KEY!);

const createUploadLink = async (): Promise<Upload> => {
    try {
        const upload = await Video.Uploads.create({
            cors_origin: '*',
            new_asset_settings: {
                playback_policy: 'public',
                max_resolution_tier: "2160p",
                normalize_audio: true,
            },
            timeout: '3600',
        });

        return upload;
    } catch (error: any) {
        captureException(new Error(`Mux Create Upload Link: ${error?.message}`), {
            data: {
                error,
            },
        });
        console.log(error)
        throw error;
    }
}


export async function POST(req: NextRequest, res: NextApiResponse) {
    try {
        const body = await new Response(req.body).json();
        const authorization = req.headers.get('authorization');
        // deviceCode is after "Bearer "
        const deviceCode = authorization?.split(' ')[1];
        const device = await getDevice(deviceCode);
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

        // Check if it's the user's first upload to the project
        const uploadCount = await prisma.upload.count({
            where: {
                userId: device.user.id,
                projectId: projectId,
            }
        });
        const isFirstUpload = uploadCount <= 1;
        if (isFirstUpload) {
            try {
                const transactionalId = TRANSACTIONAL_EMAIL_FIRST_UPLOAD_TEMPLATE_ID;
                const userEmail = device?.user?.email;
                const uploadLink = `${baseUrl}/view/${video?.id}` ?? `${baseUrl}/app`
                userEmail && loops.sendTransactionalEmail(transactionalId, userEmail, {
                    uploadLink
                });
                userEmail && loops.updateContact(userEmail, {
                    hasMadeAnUpload: true,
                });
                userEmail && loops.sendEvent(userEmail, 'First Upload');
            } catch (error) {
                console.log(error)
            }
        }

        return NextResponse.json({
            uploadLink: upload.url,
            id: video.id,
        });

    } catch (error: any) {
        console.log(error)
        console.error(error)
        captureException(new Error(`Create Upload Link: ${error?.message}`), {
            data: {
                error,
            },
        });
        return NextResponse.json({
            status: 500,
            body: {
                error: error?.message || 'Something went wrong'
            }
        });
    }
}

// Handles GET requests for fetching user uploads with pagination support
export async function GET(req: NextRequest, res: NextApiResponse) {
    try {
        const user = await getUser();
        // @ts-ignore
        // If user retrieval fails, respond with an Unauthorized error
        if (!user.id) return NextResponse.json({ error: "Unauthorized" }, {
            status: 401
        })

        // Extracting offset and limit from the query parameters
        const { searchParams } = new URL(req.url, baseUrl); // Ensure baseUrl is defined appropriately
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        // Fetch a paginated list of uploads for the current user
        const uploads = await prisma.upload.findMany({
            where: {
                // @ts-ignore
                userId: user?.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: offset,
        });

        // Fetching the total count of uploads for pagination
        const totalCount = await prisma.upload.count({
            where: {
                // @ts-ignore
                userId: user.id,
            },
        });

        if (!uploads) {
            return NextResponse.json({ error: 'No uploads found' }, {
                status: 404
            });
        }
        // Respond with the list of uploads and the total count for pagination
        return NextResponse.json({ uploads, total: totalCount });
    } catch (error: any) {
        console.error(error);
        captureException(new Error(`Fetching Uploads: ${error?.message}`), {
            data: {
                error,
            },
        });
        return NextResponse.json({
            status: 500,
            body: {
                error: error?.message || 'Failed to fetch uploads',
            }
        });
    }
}
