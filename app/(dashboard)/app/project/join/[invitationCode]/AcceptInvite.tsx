"use client";

import { navigate } from "@/actions";
import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";
import { toast } from "sonner";

interface AcceptInviteProps {
  handleAcceptInvite: () => Promise<void>;
  projectId: string;
}

export const AcceptInvite = ({
  handleAcceptInvite,
  projectId,
}: AcceptInviteProps) => {
  const onAcceptInvite = async () => {
    try {
      toast.promise(handleAcceptInvite, {
        loading: "Joining project...",
        success: "Successfully joined the project!",
        error: "Failed to join the project.",
      });
      // Redirect on successful invite acceptance
      //   redirect(`/app/project/${project.id}`);
      navigate(`/app/project/${projectId}`);
    } catch (error) {
      // Error handling can be expanded as needed
      console.error("Error joining project:", error);
    }
  };

  return <Button onClick={onAcceptInvite}>Join project</Button>;
};
