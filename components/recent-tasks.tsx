import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type Task = {
  id: string;
  name: string;
  status: string;
  assignee: {
    name: string;
    avatar: string;
    email: string;
  };
}

type RecentTasksProps = {
  tasks: Task[];
}

export function RecentTasks({ tasks }: RecentTasksProps) {
  return (
    <div className="space-y-8">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
            <AvatarFallback>
              {task.assignee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{task.name}</p>
            <p className="text-sm text-muted-foreground">
              {task.assignee.email}
            </p>
          </div>
          <div className="ml-auto">
            <Badge
              variant={
                task.status === "DONE"
                  ? "default"
                  : task.status === "IN_PROGRESS"
                  ? "secondary"
                  : "outline"
              }
            >
              {task.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

