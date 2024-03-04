import screenlinkLogo from "../assets/screenlink.svg";
import screenlinkLogoDark from "../assets/screenlink-dark.svg";
import { useTheme } from "./theme-provider";

export default function Update({ updateMessage }: { updateMessage: string }) {
  const { theme } = useTheme();
  return (
    <div className="card items-center justify-center min-h-screen w-screen bg-background text-foreground p-4">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src={theme === "dark" ? screenlinkLogoDark : screenlinkLogo}
            alt="ScreenLink"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-300">
            Required ScreenLink Update
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <p className="text-center text-sm text-gray-500">
            {updateMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
