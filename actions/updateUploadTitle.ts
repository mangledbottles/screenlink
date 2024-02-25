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
        // You can adjust the state here as needed to handle errors
        // throw new Error('Validation failed');
        console.log('Validation failed', JSON.stringify(result.error));
        alert('Validation failed');
    }

    const { id, newTitle } = result.data;

    await prisma.upload.update({
        where: { id },
        data: { sourceTitle: newTitle },
    });

    // Invalidate and refetch the data for the specific view page
    await revalidatePath(`/view/${id}`);

    // Return the new state
    return { success: true };
}