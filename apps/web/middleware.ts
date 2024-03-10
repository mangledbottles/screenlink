import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { path, fullPath } = parse(req);

    // Use regex to match {domain}/app/* paths
    const appPathRegex = /^\/app\/.*/;
    if (!appPathRegex.test(path)) {
        return;
    }

    const session = (await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    })) as {
        uid?: string;
    };

    const authIssue = !session || !session?.uid;

    if (authIssue && (path !== "/signin" &&
        path !== "/signup" &&
        path !== "/api/auth/signin" &&
        path !== "/api/auth/signup" && path !== "/api/auth/providers")) {
        return NextResponse.redirect(
            new URL(
                `/signin${path === "/" ? "" : `?redirect=${encodeURIComponent(fullPath)}`}`,
                req.url,
            ),
        );
    }

    return;
}

export const parse = (req: NextRequest) => {
    let domain = req.headers.get("host") as string;
    domain = domain.replace("www.", ""); // remove www. from domain

    // path is the path of the URL (e.g. screenlink.io/view/id -> /view/id)
    let path = req.nextUrl.pathname;

    // fullPath is the full URL path (along with search params)
    const searchParams = req.nextUrl.searchParams.toString();
    const fullPath = `${path}${searchParams.length > 0 ? `?${searchParams}` : ""
        }`;

    // Here, we are using decodeURIComponent to handle foreign languages like Hebrew
    const key = decodeURIComponent(path.split("/")[1]); // key is the first part of the path (e.g. screenlink.io/view/id -> view)
    const fullKey = decodeURIComponent(path.slice(1)); // fullKey is the full path without the first slash (to account for multi-level subpaths, e.g. screenlink.io/view/id -> view/id)

    return { domain, path, fullPath, key, fullKey };
};
