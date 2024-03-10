'use server';

import { getSession, parseZodError, prisma } from '@/app/utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';


export type EmojiType = "😍" | "🙌" | "😮" | "👍" | "👎";
const allowedEmoji = ["😍", "🙌", "😮", "👍", "👎"] as const;

const reactSchema = z.object({
    uploadId: z.string(),
    emoji: z.enum(allowedEmoji),
    userId: z.string().optional(),
});

export async function reactToUpload(params: { uploadId: string; emoji: typeof allowedEmoji[number]; }) {
    const session = await getSession();

    const result = reactSchema.safeParse(params);
    if (!result.success) {
        throw new Error(parseZodError(result.error));
    }

    const { uploadId, emoji } = result.data;

    await prisma.reaction.create({
        data: {
            emoji,
            reactedBy: session?.user?.id ?? "anonymous",
            upload: {
                connect: {
                    id: uploadId,
                },
            },
        },
    });

    await revalidatePath(`/view/${uploadId}`);
}

