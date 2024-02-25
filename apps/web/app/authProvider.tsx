"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { setUser } from "@sentry/nextjs";
import { Fragment, useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}

export const AuthUser = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      setUser({
        // @ts-ignore
        id: session?.user?.id ?? "",
        email: session?.user?.email ?? "",
        name: session?.user?.name ?? "",
        // @ts-ignore
        projectId: session?.user?.currentProjectId ?? "",
      });
    }
  }, [session]); // This ensures the effect runs whenever the session data changes

  return <Fragment />;
};
