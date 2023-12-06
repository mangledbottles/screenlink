import { PrismaClient } from '@prisma/client'
import { NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function POST(req: NextRequest, res: NextApiResponse) {
    try {
        const body = await new Response(req.body).json();
        const { email } = body;
        if (!email) return NextResponse.json({ error: "Email is required" }, {
            status: 400
        });

        // For spam prevention
        const ipAddress = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for');
        const existing = await prisma.notificationSubscription.findFirst({
            where: {
                email
            }
        });

        if (existing) {
            return NextResponse.json({ error: "Email already subscribed" }, {
                status: 201
            });
        }

        // Subscribe the new email
        await prisma.notificationSubscription.create({
            data: {
                email,
                ipAddress
            }
        });

        return NextResponse.json({ message: "Subscription successful" }, {
            status: 200
        });


    } catch (err) {
        console.log(err)
    }
}