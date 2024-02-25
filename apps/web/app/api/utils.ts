import { setUser } from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]/AuthOptions";
import { prisma } from "../utils";
import { captureException } from "@sentry/nextjs";
import { Devices, User } from "@prisma/client";

export const currentSession = async () => await getServerSession(authOptions);

export const getUser = async () => {
    try {
        const session = await currentSession();
        if (session?.user) {
            setUser({
                // @ts-ignore
                id: session?.user?.id ?? '',
                email: session?.user?.email ?? '',
                name: session?.user?.name ?? '',
                // @ts-ignore
                projectId: session?.user?.currentProjectId ?? '',
            });
        }
        return session?.user;
    } catch (error: any) {
        captureException(new Error(`Error getting session: ${error?.message}`), {
            data: {
                error,
            },
        });
        return null;
    }
}

export const getDevice = async (deviceCode?: string): Promise<(Partial<Devices> & { user: Partial<User> }) | null> => {
    try {
        if (!deviceCode) throw new Error('Device code not provided');

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
                        email: true,
                        name: true,
                        image: true,
                    }
                }
            }
        });
        return device;
    } catch (error: any) {
        captureException(new Error(`Error getting device code: ${error?.message}`), {
            data: {
                error,
            },
        });
        console.log(new Error(`Device not found: ${error?.message}`))
        return null;
    }
}