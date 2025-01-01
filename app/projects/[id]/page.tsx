"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getProjectById,
  updateProject,
  deleteProject,
  getCurrentUser,
  getTasksByProjectId,
  Task,
} from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchProjectAndTasks = async () => {
      try {
        const [fetchedProject, fetchedTasks] = await Promise.all([
          getProjectById(parseInt(params.id)),
          getTasksByProjectId(parseInt(params.id)),
        ]);
        setProject(fetchedProject);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch project or tasks:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch project details or tasks",
        });
      }
    };

    fetchProjectAndTasks();
  }, [params.id, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const updatedProjectData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "ONGOING" | "COMPLETED" | "ARCHIVED",
      startDate: formData.get("startDate") as string,
      endDate: (formData.get("endDate") as string) || null,
    };

    try {
      const updatedProject = await updateProject(
        project.id,
        updatedProjectData
      );
      setProject(updatedProject);
      setIsEditing(false);
      toast({
        title: "Project updated",
        description: "The project has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update project",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(project.id);
        toast({
          title: "Project deleted",
          description: "The project has been deleted successfully.",
        });
        router.push("/projects");
      } catch (error) {
        console.error("Failed to delete project:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete project",
        });
      }
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Project Details</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" name="name" defaultValue={project.name} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={project.description}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={project.status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={project.startDate.split("T")[0]}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={
                project.endDate ? project.endDate.split("T")[0] : ""
              }
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Project"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {project.name}
          </p>
          <p>
            <strong>Description:</strong> {project.description}
          </p>
          <p>
            <strong>Status:</strong> {project.status}
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(project.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong>{" "}
            {project.endDate
              ? new Date(project.endDate).toLocaleDateString()
              : "N/A"}
          </p>
          {currentUser &&
            (currentUser.id === project.ownerId ||
              currentUser.role === "ADMIN") && (
              <div className="space-x-2">
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            )}
        </div>
      )}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tasks</h2>
          <Link href={`/tasks/create?projectId=${project.id}`}>
            <Button>Add New Task</Button>
          </Link>
        </div>
        <Table>
          <TableCaption>A list of tasks for this project.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.name}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.priority}</TableCell>
                <TableCell>
                  {new Date(task.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link href={`/tasks/${task.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
