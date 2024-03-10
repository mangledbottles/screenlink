'use server'
import { getSession, parseZodError, prisma } from "@/app/utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for project change request validation
const changeProjectSchema = z.object({
    projectIdToChangeTo: z.string(),
});

// Handles project change requests
export const changeProject = async (params: { projectIdToChangeTo: string }) => {
    // Ensure user is logged in
    const session = await getSession();
    if (!session || !session.user) {
        throw new Error("You must be logged in to change projects");
    }
    const userId = session.user.id;

    // Validate input format
    const result = changeProjectSchema.safeParse(params);
    if (!result.success) {
        throw new Error(parseZodError(result.error));
    }

    // Check user access to the target project
    const canUserSwitchToProject = await prisma.projectUsers.findFirst({
        where: {
            projectId: params.projectIdToChangeTo,
            userId,
        },
    });
    if (!canUserSwitchToProject) {
        throw new Error("You do not have access to this project");
    }

    // Update user's current project
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            currentProjectId: params.projectIdToChangeTo,
        },
    });

    // Trigger revalidation of the /app path
    revalidatePath("/app");
    return;
};
