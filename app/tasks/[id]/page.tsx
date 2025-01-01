"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getTaskById,
  updateTask,
  deleteTask,
  getCurrentUser,
  assignTask,
  getCommentsByTaskId,
  Task,
  Comment,
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
import { CommentSection } from "@/components/comment-section";
import { useToast } from "@/hooks/use-toast";

export default function TaskDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [params, setParams] = useState<{ id: string } | null>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    paramsPromise.then(setParams);
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;

    const fetchTaskAndComments = async () => {
      try {
        const [fetchedTask, fetchedComments] = await Promise.all([
          getTaskById(parseInt(params.id)),
          getCommentsByTaskId(parseInt(params.id)),
        ]);
        setTask(fetchedTask);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to fetch task or comments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch task details or comments",
        });
      }
    };

    fetchTaskAndComments();
  }, [params, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const updatedTaskData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as string,
      priority: formData.get("priority") as string,
      dueDate: formData.get("dueDate") as string,
    };

    try {
      const updatedTask = await updateTask(task!.id, updatedTaskData);
      setTask(updatedTask);
      setIsEditing(false);
      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task!.id);
        toast({
          title: "Task deleted",
          description: "The task has been deleted successfully.",
        });
        router.push("/tasks");
      } catch (error) {
        console.error("Failed to delete task:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete task",
        });
      }
    }
  };

  const handleAssign = async (userId: number) => {
    try {
      const updatedTask = await assignTask(task!.id, userId);
      setTask(updatedTask);
      toast({
        title: "Task assigned",
        description: "The task has been assigned successfully.",
      });
    } catch (error) {
      console.error("Failed to assign task:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign task",
      });
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Task Details</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <Label htmlFor="name">Task Name</Label>
            <Input id="name" name="name" defaultValue={task.name} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={task.description}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={task.status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" defaultValue={task.priority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              defaultValue={task.dueDate.split("T")[0]}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Task"}
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
            <strong>Name:</strong> {task.name}
          </p>
          <p>
            <strong>Description:</strong> {task.description}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Assigned To:</strong>{" "}
            {task.assigneeId ? `User ${task.assigneeId}` : "Unassigned"}
          </p>
          {currentUser &&
            (currentUser.id === task.assigneeId ||
              currentUser.role === "ADMIN" ||
              currentUser.role === "PROJECT_MANAGER") && (
              <div className="space-x-2">
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            )}
          {currentUser && currentUser.role === "ADMIN" && (
            <div>
              <Label htmlFor="assignUser">Assign to User</Label>
              <Select onValueChange={(value) => handleAssign(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {/* This should be populated with actual user data */}
                  <SelectItem value="1">User 1</SelectItem>
                  <SelectItem value="2">User 2</SelectItem>
                  <SelectItem value="3">User 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        <CommentSection
          taskId={task.id}
          comments={comments}
          setComments={setComments}
        />
      </div>
    </div>
  );
}
