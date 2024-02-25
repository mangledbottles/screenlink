"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect } from "react";
import { useSession } from "next-auth/react";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session = useSession();
  // Track pageviews
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      // @ts-ignore
      posthog.identify(session.data?.user?.id ?? session.data?.user?.email, {
        $email: session.data?.user?.email,
        $name: session.data?.user?.name,
        // @ts-ignore
        $userId: session.data?.user?.id,
      });

      posthog.capture(
        "$pageview",
        {
          $current_url: url,
        },
        {
          $set: {
            // @ts-ignore
            $user_id: session.data?.user?.id,
            $email: session.data?.user?.email,
            $name: session.data?.user?.name,
          },
        }
      );
    }
  }, [pathname, searchParams]);

  return <Fragment />;
}

type Props = {
  children: React.ReactNode;
};

export function PHProvider({ children }: Props) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
