'use client'
import { CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "lucide-react";
import { baseUrl } from "@/app/utils";
import { toast } from "sonner";

interface InviteMemberProps {
  invitationCode: string;
}

export function InviteMember({ invitationCode }: InviteMemberProps) {
  const invitationUrl = `${baseUrl}/app/project/join/${invitationCode}`;

  const copy = () => {
    navigator.clipboard.writeText(invitationUrl);
    toast.success("Copied to clipboard");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Link className="mr-2 h-4 w-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
          <DialogDescription>
            Share this link with the person you want to invite to your project.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={invitationUrl} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={copy}>
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
