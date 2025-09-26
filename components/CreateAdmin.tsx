import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const CreateAdmin = () => {
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "" })

  const handleCreateAdmin = () => {
    // if (newAdmin.email && newAdmin.password) {
    //   setAdmins((prev) => [...prev, { email: newAdmin.email, password: newAdmin.password }])
    //   setNewAdmin({ email: "", password: "" })
    // }
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Create New Admin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="Enter admin email..."
              value={newAdmin.email}
              onChange={(e) => setNewAdmin((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password..."
              value={newAdmin.password}
              onChange={(e) => setNewAdmin((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <Button onClick={handleCreateAdmin} className="w-full">
            Create Admin
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export default CreateAdmin