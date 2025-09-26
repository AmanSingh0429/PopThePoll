import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Users, BarChart3, Plus, Trash2 } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const CreatePolls = () => {
  const [newPoll, setNewPoll] = useState({
    title: "",
    options: ["", ""],
  })


  const addPollOption = () => {
    if (newPoll.options.length < 10) {
      setNewPoll((prev) => ({
        ...prev,
        options: [...prev.options, ""],
      }))
    }
  }
  const removePollOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }))
    }
  }
  const createPoll = () => {
    // if (newPoll.title && newPoll.options.every((opt) => opt.trim())) {
    //   const poll = {
    //     id: Date.now().toString(),
    //     title: newPoll.title,
    //     options: newPoll.options.map((text, index) => ({
    //       id: `opt-${index}`,
    //       text,
    //       votes: 0,
    //     })),
    //     totalVotes: 0,
    //     isActive: true,
    //   }
    //   setPolls((prev) => [...prev, poll])
    //   setNewPoll({ title: "", options: ["", ""] })
    // }
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Create New Poll</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="poll-title">Poll Title</Label>
            <Input
              id="poll-title"
              placeholder="Enter your poll question..."
              value={newPoll.title}
              onChange={(e) => setNewPoll((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Poll Options</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addPollOption}
                disabled={newPoll.options.length >= 10}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Option
              </Button>
            </div>

            {newPoll.options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newPoll.options]
                    newOptions[index] = e.target.value
                    setNewPoll((prev) => ({ ...prev, options: newOptions }))
                  }}
                />
                {newPoll.options.length > 2 && (
                  <Button variant="outline" size="icon" onClick={() => removePollOption(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button onClick={createPoll} className="w-full">
            Create Poll
          </Button>
        </CardContent>
      </Card>
    </>
  )
}

export default CreatePolls