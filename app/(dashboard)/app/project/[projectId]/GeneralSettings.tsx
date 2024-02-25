"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axios from "axios";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectProps {
  project: {
    id: string;
    name: string;
    monthlyUploads: number;
    plan: string;
    startDate: Date;
  };
  isUserOwner: boolean;
}

export function ProjectSettings({ project, isUserOwner }: ProjectProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project.name,
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    toast.promise(axios.put(`/api/projects/${project.id}`, data), {
      loading: "Updating project settings...",
      success: "Project settings updated successfully",
      error: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ??
          error?.message ??
          "An unexpected error occurred";
        form.reset({ name: project.name }); // Reset form to initial state on error
        return `Failed to update project settings: ${errorMessage}`;
      },
    });
  };

  // Update form default values when project prop changes
  useEffect(() => {
    form.reset({
      name: project.name,
    });
  }, [project]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!isUserOwner} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!isUserOwner}>
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
