"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActivePolls from "@/components/ActivePolls"
import CreatePolls from "@/components/CreatePolls"
import CreateAdmin from "@/components/CreateAdmin"
import Analytics from "@/components/Analytics"

const AdminDashboard = () => {
  const logout = () => { alert("Logout") }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-red-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-balance">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Manage polls and view results</p>
            </div>
            <Button variant="destructive" onClick={logout}>
              Log Out
            </Button>
          </div>

          <Tabs defaultValue="polls" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="polls">Active Polls</TabsTrigger>
              <TabsTrigger value="create">Create Poll</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="createAdmin">Create Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="polls" className="space-y-4">
              <ActivePolls />
            </TabsContent>

            <TabsContent value="create">
              <CreatePolls />
            </TabsContent>

            <TabsContent value="analytics">
              <Analytics />
            </TabsContent>

            <TabsContent value="createAdmin">
              <CreateAdmin />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard