'use server'
import { getSession, prisma } from '@/app/utils';
import { logsnag } from '@/utils/logsnag';

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

    if (persona?.length > 0 && workspaceName?.length > 0) {
        logsnag.track({
            user_id: session?.user?.id,
            event: 'Onboarding Completed',
            tags: {
                persona,
                workspace_name: workspaceName,
            },
            icon: '🏔️',
            channel: 'onboarding',
        });

        // TODO: Send email to user with onboarding details
    }

    return project;
}