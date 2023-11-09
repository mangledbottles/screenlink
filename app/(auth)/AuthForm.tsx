"use client";

import { BuiltInProviderType, Provider } from "next-auth/providers";
import {
  ClientSafeProvider,
  LiteralUnion,
  signIn,
  useSession,
} from "next-auth/react";
import React from "react";
import {
  AiFillGithub,
  AiOutlineGoogle,
  AiOutlineQuestionCircle,
  AiOutlineSlack,
} from "react-icons/ai";

const ICONS: {
  [key: string]: React.ComponentType<any>;
} = {
  github: AiFillGithub,
  google: AiOutlineGoogle,
  slack: AiOutlineSlack,
};

const SocialButton = ({ provider }: { provider: any }) => {
  const icon =
    ICONS[provider.id as keyof typeof ICONS] || AiOutlineQuestionCircle;
  return (
    <div className="mb-4 w-full" key={provider.name}>
      <button
        onClick={() => signIn(provider.id)}
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded px-2.5 py-2.5 text-base shadow-sm text-white bg-indigo-500 hover:bg-indigo-600  w-full"
      >
        {React.cloneElement(React.createElement(icon), {
          className: "w-5 h-5",
        })}
        <span className={"ml-4"}>Continue with {provider.name}</span>
      </button>
    </div>
  );
};

export default function AuthForm({
  providers,
}: {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}) {
  if (!providers) return null;
  return (
    <div className="flex flex-col">
      {Object.values(providers).map((provider: ClientSafeProvider) => {
        if (!provider?.name || !provider?.id) return null;
        return <SocialButton key={provider.name} provider={provider} />;
      })}
    </div>
  );
}
