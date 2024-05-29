'use server'
import { getSession, prisma } from '@/app/utils';

export async function syncOnboarding({ persona, workspaceName }: { persona: string, workspaceName: string }) {
    const session = await getSession();
    // @ts-ignore
    const projectId = session?.user?.currentProjectId;

    if (!projectId) {
        throw new Error('No project found');
    }
    const project = await prisma.project.update({
        where: {
            id: projectId,
        },
        data: {
            onboardingPersona: persona,
            name: workspaceName,
        },
    });

    return project;
}