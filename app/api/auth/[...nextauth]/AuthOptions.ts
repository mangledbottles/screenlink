import type { NextAuthOptions, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
// import SlackProvider from "next-auth/providers/slack";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient, Project } from "@prisma/client";
const prisma = new PrismaClient();

declare global {
    interface Window {
        Tawk_API: any;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    callbacks: {
        session: async ({ session, token, user }) => {
            if (session?.user) {
                // @ts-ignore
                session.user.id = token.uid;
                // console.log({ session, token, user, userId: token.uid })
            }
            return session;
        },
        jwt: async ({ user, token }) => {
            if (user) {
                token.uid = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth",
    },
    events: {
        async signIn(message) {
            console.log("User sign in started");

            let userHasProject: boolean = false;
            let existingProject: Project | null = null;

            if (!message.isNewUser) {
                console.log("Existing user, trying to find associated project");
                const project = await prisma.project.findFirst({
                    where: {
                        users: {
                            some: {
                                userId: message.user.id,
                            },
                        },
                    },
                });

                userHasProject = project !== null;
                existingProject = project;

                console.log(`User has project: ${userHasProject}`);

                if (userHasProject) {
                    console.log("User has project, updating user's currentProjectId");
                    await prisma.user.update({
                        where: {
                            id: message.user.id,
                        },
                        data: {
                            currentProjectId: project?.id,
                        },
                    });
                    console.log("User's currentProjectId updated with existing project id");
                    return;
                }

            }

            if (message.isNewUser || !userHasProject) {
                console.log("New user or user without project");

                console.log("No existing project found, creating new project");
                const projectName = String(`${message.user.name}'s project`);
                const project = await prisma.project.create({
                    data: {
                        name: projectName,
                        users: {
                            create: {
                                role: 'owner',
                                user: {
                                    connect: {
                                        id: message.user.id,
                                    },
                                },
                            },
                        },
                    }
                });

                console.log("New project created, updating user's currentProjectId");
                await prisma.user.update({
                    where: {
                        id: message.user.id,
                    },
                    data: {
                        currentProjectId: project.id,
                    },
                });
                console.log("User's currentProjectId updated with new project id");
            }

            console.log("User sign in completed");
        },
    },
};
