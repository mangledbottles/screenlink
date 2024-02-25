"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PopoverContent } from "@/components/ui/popover";
import { Role } from "@prisma/client";
import { ExtendedProjectUser } from "./TeamMembers";
import { useState } from "react";
import { toast } from "sonner";

interface TeamRolesProps {
  currentUserRole: Role;
  currentUserId: string;
  projectUser: ExtendedProjectUser;
  updateRole: (
    projectUser: ExtendedProjectUser,
    newRole: Role
  ) => Promise<void>;
}

export function TeamRoles({
  currentUserRole,
  currentUserId,
  projectUser,
  updateRole,
}: TeamRolesProps) {
  // Roles definition with corrected permissions
  const roles = [
    {
      value: "owner",
      label: "Owner",
      description: "Full access to all resources and settings.",
      canUserChange: () =>
        // An owner can change another owner's role, but not their own
        currentUserRole === "owner" && currentUserId !== projectUser.user.id,
    },
    {
      value: "admin",
      label: "Admin",
      description: "Can manage projects, users, and settings.",
      canUserChange: () =>
        // An admin can promote a member to admin. An owner can change any user's role, including downgrading another owner to admin.
        (currentUserRole === "admin" && projectUser.role === "member") ||
        (currentUserRole === "owner" && currentUserId !== projectUser.user.id),
    },
    {
      value: "member",
      label: "Member",
      description: "Can create and share ScreenLinks!",
      canUserChange: () =>
        // An admin can downgrade themselves to a member. An owner can change any user's role, including downgrading another owner to member.
        (currentUserRole === "admin" && currentUserId === projectUser.userId) ||
        (currentUserRole === "owner" && currentUserId !== projectUser.user.id),
    },
  ];

  const handleRoleClick = () => {
    const roleToChangeTo = roles.find((role) => role.value === hoveredRole);

    // Ensure the role exists and the current user can change to the selected role
    if (!roleToChangeTo || !roleToChangeTo.canUserChange()) {
      return toast.error("You can't change this user's role.");
    }

    // Proceed with role update if allowed
    toast.promise(updateRole(projectUser, hoveredRole), {
      loading: `Updating ${projectUser.user.name} to ${hoveredRole} role...`,
      success: `Role updated successfully! ${projectUser.user.name} is now a ${hoveredRole}.`,
      error: (err) => `Error updating role. ${err.message || ""}`,
    });
  };

  const [hoveredRole, setHoveredRole] = useState<Role>(projectUser.role);

  return (
    <PopoverContent className="p-0" align="end">
      <Command
        value={hoveredRole}
        onValueChange={(newValue) => {
          if (newValue.includes("owner")) setHoveredRole(Role.owner);
          if (newValue.includes("admin")) setHoveredRole(Role.admin);
          if (newValue.includes("member")) setHoveredRole(Role.member);
        }}
      >
        <CommandInput placeholder="Select new role..." />
        <CommandList>
          <CommandEmpty>No roles found.</CommandEmpty>
          <CommandGroup onClick={handleRoleClick}>
            {/* To ensure no Item automatically highlighted  */}
            <CommandItem value="-" className="hidden" />

            {roles.map(({ value, label, description, canUserChange }) => (
              <CommandItem
                key={value}
                className={`space-y-1 flex flex-col items-start px-4 py-2 cursor-pointer ${
                  projectUser.role === value ? "bg-accent" : ""
                } ${canUserChange() ? "" : "cursor-not-allowed"}`}
                data-value={value}
              >
                <p>{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  );
}
