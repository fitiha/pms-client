"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentTasks } from "@/components/recent-tasks"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { getUserProjects, getUserOwnedProjects, getAllProjects, getAllTasks } from "@/lib/auth"

import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [userProjects, setUserProjects] = useState([])
  const [ownedProjects, setOwnedProjects] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [projects, owned, all, tasks] = await Promise.all([
            getUserProjects(user.id),
            getUserOwnedProjects(user.id),
            getAllProjects(),
            getAllTasks()
          ])
          setUserProjects(projects)
          setOwnedProjects(owned)
          setAllProjects(all)
          setAllTasks(tasks)
        } catch (error) {
          console.error('Failed to fetch data:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch dashboard data",
          })
        }
      }
    }
    fetchData()
  }, [user, toast])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Link href="/projects/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Project
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owned Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownedProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTasks.length}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview projects={allProjects} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTasks tasks={allTasks.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

