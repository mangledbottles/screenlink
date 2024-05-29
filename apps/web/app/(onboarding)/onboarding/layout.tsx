import { Link } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/logo.svg";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden m-10">
      <div className="px-6 py-8">
        <div className="flex items-end mb-4">
          <Image src={Logo} className="w-8 h-8" priority alt="ScreenLink" />
          <h2 className="text-xl font-semibold text-white ml-2">
            ScreenLink Onboarding
          </h2>
        </div>
        <div className="text-slate-200">{children}</div>
      </div>
    </div>
  );
}
