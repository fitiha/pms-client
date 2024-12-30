import { UserProfile } from "@/components/user-profile"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Your Profile</h1>
      <UserProfile />
    </div>
  )
}

