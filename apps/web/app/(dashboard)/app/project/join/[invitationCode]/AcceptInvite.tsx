"use client";

import { navigate } from "@/actions";
import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

interface AcceptInviteProps {
  handleAcceptInvite: () => Promise<void>;
  projectId: string;
}

export const AcceptInvite = ({
  handleAcceptInvite,
  projectId,
}: AcceptInviteProps) => {
  const [isJoining, setIsJoining] = useState(false);

  const onAcceptInvite = async () => {
    setIsJoining(true);
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
      setIsJoining(false);
    }
  };

  return <Button onClick={onAcceptInvite} disabled={isJoining} >Join project</Button>;
};
