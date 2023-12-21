import type { NextAuthOptions, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
// import SlackProvider from "next-auth/providers/slack";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { loops, posthog_serverside } from "@/app/utils";
import { captureException } from "@sentry/nextjs";

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
            try {
                if (session?.user) {
                    const userId = token.uid as string;
                    if (!userId) throw new Error("No user id found in token");
                    // @ts-ignore
                    session.user.id = userId;
                    // console.log({ session, token, userId })
                    const user = await prisma.user.findUnique({
                        where: {
                            id: userId,
                        },
                        select: {
                            name: true,
                            currentProjectId: true,
                        },
                    });
                    if (!user) throw new Error(`User not found: ${userId}`);

                    if (!user.currentProjectId) {
                        const firstProject = await prisma.project.findFirst({
                            where: {
                                users: {
                                    some: {
                                        userId,
                                    },
                                },
                            },
                        });
                        if (firstProject) {
                            console.log(`User has no current project, setting to first project: ${firstProject.id}`);
                            // @ts-ignore
                            session.user.currentProjectId = firstProject.id;
                        }
                        else {
                            console.log("User has no current project, creating new project");
                            const projectName = String(`${user.name}'s project`);
                            const project = await prisma.project.create({
                                data: {
                                    name: projectName,
                                    users: {
                                        create: {
                                            role: 'owner',
                                            user: {
                                                connect: {
                                                    id: userId,
                                                },
                                            },
                                        },
                                    },
                                }
                            });
                            // @ts-ignore
                            session.user.currentProjectId = project.id;
                        }

                        await prisma.user.update({
                            where: {
                                // @ts-ignore
                                id: session?.user?.id
                            },
                            data: {
                                // @ts-ignore
                                currentProjectId: session?.user?.currentProjectId
                            }
                        })
                    } else {
                        // console.log("User has current project set");
                        // @ts-ignore
                        session.user.currentProjectId = user.currentProjectId;
                    }
                }

                return session;
            } catch (error: any) {
                captureException(new Error(`Session Callback: ${error?.message}`));
                return session;
            }
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
        signIn: "/signin",
    },
    events: {
        async signIn(message) {
            try {
                console.log("User sign in completed");
                if (message.isNewUser) {
                    console.log("New user sign up")
                    const [firstName, lastName] = message?.user?.name?.split(" ") ?? ["", ""];
                    loops.createContact(message?.user?.email ?? "unknown", {
                        firstName: firstName ?? "",
                        lastName: lastName ?? "",
                        source: "SignUp",
                        userId: message?.user?.id ?? "",
                    });
                    loops.sendEvent(message?.user?.email ?? "unknown", "Sign Up");

                    posthog_serverside.capture({
                        distinctId: message.user.id || message.user.email || "unknown",
                        event: 'Registered',
                        groups: {
                            // @ts-ignore
                            projectId: message.user.currentProjectId ?? null,
                        },
                        properties: {
                            ...message.user,
                            ...message.account,
                            ...message.profile,
                        },
                    });
                } else {
                    console.log("Existing user sign in")
                    posthog_serverside.capture({
                        distinctId: message.user.id || message.user.email || "unknown",
                        event: 'Logged In',
                        groups: {
                            // @ts-ignore
                            projectId: message.user.currentProjectId ?? null,
                        },
                        properties: {
                            ...message.user,
                            ...message.account,
                            ...message.profile,
                        },
                    });
                }
            } catch (error: any) {
                console.log(error)
                captureException(new Error(`Sign In Event: ${error?.message}`), {
                    data: {
                        error,
                    },
                });
            }
        },
    },
};
