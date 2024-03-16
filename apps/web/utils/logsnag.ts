import { LogSnag } from '@logsnag/next/server';

export const logsnag = new LogSnag({
    token: process.env.LOGSNAG_API_TOKEN!,
    project: process.env.LOGSNAG_PROJECT!,
});

