"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProject, getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'

export default function CreateProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const projectData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string || null,
      ownerId: getCurrentUser()?.id,
    }
    console.log("firstName", projectData)
    try {
      await createProject(projectData)
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      })
      router.push('/projects')
    } catch (error) {
      console.error('Failed to create project:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create project",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select name="status" required>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONGOING">Ongoinig</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" name="startDate" type="date" required />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" name="endDate" type="date" />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </div>
  )
}

