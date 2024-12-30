import { jwtDecode } from "jwt-decode";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "PROJECT_MANAGER" | "USER";
};

type LoginResponse = {
  message: string;
  token: string;
};

export async function register(formData: FormData) {
  const res = await fetch("http://localhost:3000/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: "USER", // Default role for new registrations
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to register");
  }

  return res.json();
}

export async function login(formData: FormData): Promise<LoginResponse> {
  const res = await fetch("http://localhost:3000/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  const responseData = await res.json();
  console.log("server response", responseData);

  if (!res.ok) {
    throw new Error(responseData.message || "Failed to login");
  }

  const data: LoginResponse = responseData;
  localStorage.setItem("token", data.token);
  return data;
}

export function getCurrentUser(): User | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ userId: number; role: User["role"] }>(token);
    return {
      id: decoded.userId,
      name: "", // We don't have the name in the token, so we'll need to fetch it separately
      email: "", // Same for email
      role: decoded.role,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export async function fetchUserDetails(userId: number): Promise<User> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user details");
  }

  return res.json();
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export async function updateUser(userId: number, data: Partial<User>) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update user");
  }

  return res.json();
}

export async function getUserProjects(userId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/users/${userId}/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user projects");
  }

  return res.json();
}

export async function getUserOwnedProjects(userId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(
    `http://localhost:3000/users/${userId}/owned-projects`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user owned projects");
  }

  return res.json();
}

export async function getAllProjects() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("http://localhost:3000/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }

  return res.json();
}

export async function getProjectById(id: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/projects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch project");
  }

  return res.json();
}

export async function createProject(projectData: any) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch("http://localhost:3000/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!res.ok) {
    throw new Error("Failed to create project");
  }

  return res.json();
}

export async function updateProject(id: number, projectData: any) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  if (!res.ok) {
    throw new Error("Failed to update project");
  }

  return res.json();
}

export async function deleteProject(id: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete project");
  }

  return res.json();
}

export type Task = {
  id: number;
  name: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  projectId: number;
  assigneeId: number | null;
};

export async function getTasksByProjectId(projectId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/projects/${projectId}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

export async function createTask(projectId: number, taskData: Partial<Task>) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return res.json();
}

export async function updateTask(taskId: number, taskData: Partial<Task>) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) {
    throw new Error("Failed to update task");
  }

  return res.json();
}

export async function deleteTask(taskId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete task");
  }

  return res.json();
}

export async function getAllTasks(filters?: {
  status?: string;
  priority?: string;
  assigneeId?: number;
}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  let url = "http://localhost:3000/tasks";
  if (filters) {
    const params = new URLSearchParams(filters as Record<string, string>);
    url += `?${params.toString()}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return res.json();
}

export async function getTaskById(taskId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch task");
  }

  return res.json();
}

export async function assignTask(taskId: number, assigneeId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/tasks/${taskId}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ assigneeId }),
  });

  if (!res.ok) {
    throw new Error("Failed to assign task");
  }

  return res.json();
}

export async function getCommentsByTaskId(taskId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/tasks/${taskId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }

  return res.json();
}

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  taskId: number;
  authorId: number;
  author: User;
};

export async function createComment(taskId: number, content: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("No user found");

  const res = await fetch(`http://localhost:3000/tasks/${taskId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, userId: currentUser.id }),
  });

  if (!res.ok) {
    throw new Error("Failed to create comment");
  }

  return res.json();
}

export async function updateComment(commentId: number, content: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error("Failed to update comment");
  }

  return res.json();
}

export async function deleteComment(commentId: number) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete comment");
  }

  return res.json();
}
