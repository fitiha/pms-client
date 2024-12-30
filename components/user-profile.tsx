"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, getCurrentUser, fetchUserDetails, updateUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = getCurrentUser()
      if (currentUser) {
        try {
          const userDetails = await fetchUserDetails(currentUser.id)
          setUser(userDetails)
        } catch (error) {
          console.error('Failed to fetch user details:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch user details",
          })
        }
      } else {
        router.push('/login')
      }
    }
    fetchUser()
  }, [router, toast])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const updatedUser = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    }

    try {
      const result = await updateUser(user.id, updatedUser)
      setUser(result)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error('Failed to update user:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>View and edit your profile information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={user.name} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" defaultValue={user.email} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

