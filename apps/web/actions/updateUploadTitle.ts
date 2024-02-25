'use server';

import { prisma } from '@/app/utils';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// Define the schema for the title update payload
const updateTitleSchema = z.object({
    id: z.string(),
    newTitle: z.string().min(1, "Title cannot be empty"),
});

// Adjust the function signature to match useFormState expectations
export async function updateTitle(params: { id: string, newTitle: string }) {
    const result = updateTitleSchema.safeParse(params);

    if (!result.success) {
        return { success: false, error: 'Validation failed' }; // Handle error case
    }

    const { id, newTitle } = result.data;

    await prisma.upload.update({
        where: { id },
        data: { sourceTitle: newTitle },
    });

    await revalidatePath(`/view/${id}`);

    return { success: true };
}