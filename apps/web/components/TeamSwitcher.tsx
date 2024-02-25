"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@components/ui/command";
import {
  Dialog
} from "@components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Project } from "@prisma/client";
import { toast } from "sonner";
import { Settings, Users } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  projects: Project[];
  currentProjectId: string;
  changeProject: (projectId: string) => Promise<void>;
}

export default function TeamSwitcher({
  className,
  projects,
  currentProjectId,
  changeProject,
}: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project>(
    projects.find((project) => project.id === currentProjectId) ?? projects[0]
  );

  const handleProjectChange = (project: Project) => {
    toast.promise(changeProject(project.id), {
      loading: "Switching project...",
      success() {
        setSelectedProject(project);
        // @ts-ignore
        signIn(null);
        return "Project switched. Refreshing page...";
      },
      error(errorMessage: string) {
        return `Failed to switch project ${errorMessage}`;
      },
    });

    setOpen(false);
  };

  const CurrentProject = () => {
    return (
      <CommandGroup key={selectedProject.id}>
        <Link href={`/app/project/${selectedProject.id}`}>
          <CommandItem
            key={selectedProject.id}
            className="text-sm hover:bg-inherit cursor-pointer"
            onSelect={() => setOpen(false)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedProject.id}.png`}
                alt={selectedProject.name}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedProject.name}{" "}
            <span className="ml-3 inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
              {selectedProject.plan}
            </span>
          </CommandItem>
        </Link>
        <Link href={`/app/project/${selectedProject.id}`}>
          <CommandItem key={"settings"} className="text-sm cursor-pointer">
            <Settings className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Settings
          </CommandItem>
        </Link>

        <Link href={`/app/project/${selectedProject.id}/members`}>
          <CommandItem key={"members"} className="text-sm cursor-pointer">
            <Users className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            Members
          </CommandItem>
        </Link>
      </CommandGroup>
    );
  };

  return (
    <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("inline-flex items-center", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedProject.id}.png`}
                alt={selectedProject.name}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <div className="max-w-[300px] truncate">{selectedProject.name}</div>
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] ml-24">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search project..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CurrentProject />
              <CommandGroup key={"switch-team"} heading={"Switch Project"}>
                {projects
                  .filter((project) => project.id !== selectedProject.id)
                  .map((project) => (
                    <CommandItem
                      key={project.id}
                      onSelect={() => handleProjectChange(project)}
                      className="text-sm cursor-pointer"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${project.id}.png`}
                          alt={project.name}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {project.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedProject.id === project.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
            {/* <CommandSeparator /> */}
            {/* <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewProjectDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Project
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList> */}
          </Command>
        </PopoverContent>
      </Popover>
      {/* TODO: Add logic to support creating new team */}
      {/* <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowNewProjectDialog(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              setShowNewProjectDialog(false);
              toast(
                "Adding new teams not yet available! You can add users to your project. Contact support for more."
              );
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent> */}
    </Dialog>
  );
}
