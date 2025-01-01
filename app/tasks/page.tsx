"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllTasks, getCurrentUser, User, Task } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string | undefined>(
    "ALL"
  );
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await getAllTasks({
          status: statusFilter === "ALL" ? undefined : statusFilter,
          priority: priorityFilter === "ALL" ? undefined : priorityFilter,
        });
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch tasks",
        });
      }
    };

    const user = getCurrentUser();
    setCurrentUser(user);

    fetchTasks();
  }, [toast, statusFilter, priorityFilter]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link href="/tasks/create">
          <Button>Create New Task</Button>
        </Link>
      </div>
      <div className="flex gap-4 mb-4">
        <Select onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setPriorityFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableCaption>A list of your tasks.</TableCaption>
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
  );
}
