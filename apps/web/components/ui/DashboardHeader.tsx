import Link from "next/link";
import Header from "./header";
import Logo from "@/public/logo.svg";
import Image from "next/image";

export default function DashboardHeader({
  nav = true,
  isAuthenticated = false,
}: {
  nav?: boolean;
  isAuthenticated?: boolean;
}) {
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link className="block" href="/app" aria-label="Cruip">
              <Image src={Logo} className="w-8 h-8" priority alt="ScreenLink" />
            </Link>
          </div>
          {/* Desktop navigation */}
          {nav && (
            <nav className="flex grow">
              {/* Desktop sign in links */}
              <ul className="flex grow justify-end flex-wrap items-center">
                <li>
                  <Link
                    className="font-medium text-slate-500 hover:text-slate-300 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                    href="/app"
                  >
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    className="font-medium text-slate-500 hover:text-slate-300 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                    href="/app/devices"
                  >
                    Devices
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
