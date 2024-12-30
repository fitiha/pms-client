"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllProjects, getCurrentUser, User } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast'


type Project = {
  id: number
  name: string
  description: string
  status: string
  startDate: string
  endDate: string | null
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getAllProjects()
        setProjects(fetchedProjects)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch projects",
        })
      }
    }

    const user = getCurrentUser()
    setCurrentUser(user)

    fetchProjects()
  }, [toast])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        {currentUser && ["ADMIN", "PROJECT_MANAGER"].includes(currentUser.role) && (
          <Link href="/projects/create">
            <Button>Create New Project</Button>
          </Link>
        )}
      </div>
      <Table>
        <TableCaption>A list of your projects.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</TableCell>
              <TableCell>
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

