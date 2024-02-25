import screenlinkLogo from "../assets/screenlink.svg";
import screenlinkLogoDark from "../assets/screenlink-dark.svg";
import { useTheme } from "./theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { CheckCircle2, HelpCircle } from "lucide-react";

export const Permissions = ({
  permissionsMessage,
}: {
  permissionsMessage: string | null;
}) => {
  const { theme } = useTheme();
  return (
    <>
      <div className="card">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src={theme === "dark" ? screenlinkLogoDark : screenlinkLogo}
            alt="ScreenLink"
          />
        </div>
        <div className="flex flex-col space-y-4 w-4/6 mx-auto mt-2">
          <div className="justify-center my-4">
            <p className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-300">
              Welcome to{" "}
              <span className="text-indigo-600 hover:text-indigo-500">
                ScreenLink
              </span>
            </p>
            <p className="text-center text-md font-bold leading-9 tracking-tight text-gray-300">
              The Open Source Screen Recorder! 🎉{" "}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                We need to enable some permissions to get going
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between space-x-2 text-left">
                <Label className="flex flex-col space-y-1">
                  <span>Screen Sharing</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Allow access to your screen to record your screen
                  </span>
                </Label>
                <GrantPermissions
                  permissionsMessage={permissionsMessage}
                  source="Screen"
                />
              </div>
              <div className="flex items-center justify-between space-x-2 text-left">
                <Label className="flex flex-col space-y-1">
                  <span>Camera</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Allow access to your camera to record your camera
                  </span>
                </Label>
                <GrantPermissions
                  permissionsMessage={permissionsMessage}
                  source="Camera"
                />
              </div>
              <div className="flex items-center justify-between space-x-2 text-left">
                <Label className="flex flex-col space-y-1">
                  <span>Microphone</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Allow access to your microphone to record your microphone
                  </span>
                </Label>
                <GrantPermissions
                  permissionsMessage={permissionsMessage}
                  source="Microphone"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const GrantPermissions = ({
  permissionsMessage,
  source,
}: {
  permissionsMessage: string | null;
  source: string;
}) => {
  return permissionsMessage?.includes(source) ? (
    <>
      <Button
        variant="outline"
        onClick={() => {
          window.electron.requestPermission(source);
        }}
      >
        <HelpCircle className="text-red-500 mr-2 h-4 w-4" />
        Grant Permission
      </Button>
    </>
  ) : (
    <>
      <Button variant="outline" disabled>
        <CheckCircle2 className="text-green-500 mr-2 h-4 w-4" />
        Granted
      </Button>
    </>
  );
};
