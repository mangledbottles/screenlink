import { Account, Preference, logout } from "@/utils";
import screenlinkLogo from "../assets/screenlink.svg";
import screenlinkLogoDark from "../assets/screenlink-dark.svg";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useEffect, useMemo, useState } from "react";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useTheme } from "./theme-provider";

export function NavBar() {
  const [account, setAccount] = useState<Account | null>(null);
  const [preferences, setPreferences] = useState<Preference[] | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const getAccount = async () => {
      const account = await window.electron.getAccount();
      setAccount(account);
    };
    getAccount();

    const getPreferences = async () => {
      const preferences = await window.electron.getPreferences();
      setPreferences(preferences);
    };
    getPreferences();
  }, []);

  const errorLoggingPreference = useMemo(() => {
    const foundPreference = preferences?.find(
      (preference) => preference.name === "error-logging"
    )?.value;
    return foundPreference !== undefined ? Boolean(foundPreference) : true;
  }, [preferences]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img
          className="h-10 w-auto mb-2 cursor-pointer"
          src={theme === "dark" ? screenlinkLogoDark : screenlinkLogo}
          alt="ScreenLink"
          onClick={() => {
            window.electron.openInBrowser("https://screenlink.io/app");
          }}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={account?.user.image} alt={account?.name} />
                  <AvatarFallback>{account?.name[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {account?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {account?.user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    window.electron.openInBrowser("https://screenlink.io/app");
                  }}
                >
                  Recordings
                  {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    Settings
                    {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                </DialogTrigger>
                {/* <Settings /> */}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                Log out
                {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription className="grid gap-6 pt-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label
                    htmlFor="necessary"
                    className="flex flex-col space-y-1"
                  >
                    <span>Error logging and debugging</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      This helps us know when things go wrong and how to fix
                      them.
                    </span>
                  </Label>
                  <Switch
                    id="necessary"
                    checked={errorLoggingPreference ?? false}
                    onCheckedChange={(checked) => {
                      setPreferences([
                        {
                          name: "error-logging",
                          value: checked,
                        },
                      ]);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                    <span>Always Dark Mode</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      This will set the application to always use dark mode.
                    </span>
                  </Label>
                  <Switch
                    id="darkMode"
                    checked={theme === "dark" ?? false}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "dark" : "light");
                    }}
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.electron.updatePreferences(preferences ?? []);
                  }}
                  type="submit"
                >
                  Save preferences
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
