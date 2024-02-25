import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ProjectUsers, Role, User, Project } from "@prisma/client";
import {
  Session,
  getAvatarFallbackInitials,
  prisma,
  toUpperCamelCase,
} from "@/app/utils";
import { TeamRoles } from "./TeamRoles";
import { revalidatePath } from "next/cache";
import { InviteMember } from "./InviteMember";

export interface ExtendedProjectUser extends ProjectUsers {
  user: User;
  project: Project;
}

interface TeamMembersProps {
  projectUsers: ExtendedProjectUser[];
  currentUserRole: Role;
  currentUser: Session;
}

export function TeamMembers({
  projectUsers,
  currentUserRole,
  currentUser,
}: TeamMembersProps) {
  
  async function updateRole(projectUser: ExtendedProjectUser, newRole: Role) {
    "use server";

    // Validation: Check if the current user can change the target user's role
    const canChangeRole = (
      currentUserId: string,
      currentUserRole: Role,
      targetUserRole: Role
    ) => {
      if (
        currentUserRole === "owner" &&
        currentUserId !== projectUser.user.id
      ) {
        return true; // Owner can change any role except their own
      } else if (currentUserRole === "admin") {
        if (
          targetUserRole === "member" ||
          (newRole === "member" && currentUserId === projectUser.userId)
        ) {
          return true; // Admin can promote a member to admin or downgrade themselves to member
        }
      }
      return false; // Default case where role change is not allowed
    };

    if (
      !canChangeRole(currentUser.user.id, currentUserRole, projectUser.role)
    ) {
      throw new Error("Unauthorized role change attempt.");
    }

    await prisma.projectUsers.update({
      where: {
        userId_projectId: {
          userId: projectUser.userId,
          projectId: projectUser.projectId,
        },
      },
      data: { role: newRole },
    });

    // Invalidate and refetch the data for the specific view page
    await revalidatePath(`/view/${projectUser.projectId}/members`);
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div>
          <div className="flex justify-between">
            <CardTitle>Team Members</CardTitle>
            {currentUserRole == Role.admin || currentUserRole == Role.owner ? (
              <InviteMember
                invitationCode={projectUsers[0]?.project?.invitationCode ?? ""}
              />
            ) : null}
          </div>
          <CardDescription>
            Invite your team members to collaborate with on ScreenLink.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        {projectUsers.map((projectUser) => {
          return (
            <div
              key={projectUser.userId}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={projectUser?.user?.image ?? ""} />
                  <AvatarFallback>
                    {getAvatarFallbackInitials(projectUser?.user?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {projectUser.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {projectUser.user.email}
                  </p>
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    {toUpperCamelCase(projectUser.role)}{" "}
                    <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <TeamRoles
                  currentUserId={currentUser.user.id}
                  currentUserRole={currentUserRole}
                  projectUser={projectUser}
                  updateRole={updateRole}
                />
              </Popover>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
